import { google } from 'googleapis';
import { RESTPlannerItem } from '@/modules/common/types';
import { prisma } from '@/server/prisma';
import { googleAuth } from '../utils/googleAuth';
import { CredentialWithConnectedGoogleTask } from '../types';

interface UpdateTaskListParams {
  credential: CredentialWithConnectedGoogleTask;
  plannerItems: Array<RESTPlannerItem & { connectedTaskId?: string }>;
}

export const updateTasklist = async ({ credential, plannerItems }: UpdateTaskListParams) => {
  const { connectedGoogleTask } = credential;
  const gAuth = await googleAuth(credential)?.getToken();

  if (!gAuth) {
    throw new Error('Credential is invalid');
  }

  const tasksService = google.tasks({
    version: 'v1',
    auth: gAuth,
  });

  let tasklistId = credential.connectedGoogleTask.connectedTaskId;

  /**
   * Check if tasklist exists, if not create a new one
   */
  try {
    await tasksService.tasklists.get({
      tasklist: tasklistId,
    });
  } catch (error) {
    if ((error as any).code === 404) {
      const { data } = await tasksService.tasklists.insert({
        requestBody: {
          title: 'ICantvas',
        },
      });

      if (!data.id) {
        // Just give up :(
        return;
      }
      tasklistId = data.id;
      await prisma.connectedGoogleTask.update({
        where: {
          id: credential.connectedGoogleTask.id,
        },
        data: {
          connectedTaskId: tasklistId,
        },
      });
    } else {
      return;
    }
  }

  const connectedTaskIds = (
    await Promise.allSettled(
      plannerItems.map(async (item) => {
        if (!item.connectedTaskId) {
          const {
            data: { id },
          } = await tasksService.tasks.insert({
            tasklist: tasklistId,
            requestBody: {
              title: item.plannable.title,
              due: item.plannable.due_at?.toString(),
              notes: `${item.context_name}

  https://ateneo.instructure.com${item.html_url}`, // Change this to be more dynamic later
            },
          });

          return id;
        }

        await tasksService.tasks.update({
          tasklist: tasklistId,
          task: item.connectedTaskId,
          requestBody: {
            id: item.connectedTaskId,
            title: item.plannable.title,
            due: item.plannable.due_at?.toString(),
            notes: `${item.context_name},

  https://ateneo.instructure.com${item.html_url}`, // Change this to be more dynamic later
          },
        });

        return item.connectedTaskId;
      })
    )
  ).map((res) => {
    if (res.status === 'fulfilled') {
      return res.value;
    }
    return '';
  });

  const updatedPlannerItems = plannerItems.map((item) => ({
    id: String(item.plannable_id),
    updatedAt: new Date(item.plannable.updated_at),
  }));

  console.time('a');

  await prisma.$transaction([
    ...updatedPlannerItems.map((item) =>
      prisma.plannerItem.upsert({
        where: { id: item.id },
        update: {
          updatedAt: item.updatedAt,
        },
        create: item,
      })
    ),

    prisma.connectedGoogleTask.update({
      where: {
        id: connectedGoogleTask.id,
      },
      data: {
        updatedAt: new Date(),
      },
    }),

    prisma.plannerItemOnConnGoogleTask.createMany({
      data: updatedPlannerItems.map((item, i) => ({
        connectedGoogleTaskId: connectedGoogleTask.id,
        plannerItemId: item.id,
        googleTaskId: connectedTaskIds[i] || '',
      })),
      skipDuplicates: true,
    }),
  ]);

  console.timeEnd('a');
};
