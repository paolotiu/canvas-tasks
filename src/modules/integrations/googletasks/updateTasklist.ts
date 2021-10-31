import { google } from 'googleapis';
import { RESTPlannerItem } from '@/modules/common/types';
import { prisma } from '@/server/prisma';
import { googleAuth } from '../utils/googleAuth';
import { CredentialWithConnectedGoogleTask } from '../types';

interface UpdateTaskListParams {
  credential: CredentialWithConnectedGoogleTask;
  plannerItems: RESTPlannerItem[];
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

  await Promise.all(
    plannerItems.map(async (item) => {
      await tasksService.tasks.insert({
        tasklist: tasklistId,
        requestBody: {
          title: item.plannable.title,
          due: item.plannable.due_at?.toString(),
          notes: `${item.context_name}

  https://ateneo.instructure.com${item.html_url}`, // Change this to be more dynamic later
        },
      });
    })
  );

  const plannerItemIds = plannerItems.map((item) => ({ id: String(item.plannable_id) }));

  await prisma.$transaction([
    prisma.plannerItem.createMany({
      data: plannerItemIds,
      skipDuplicates: true,
    }),

    prisma.connectedGoogleTask.update({
      where: {
        id: connectedGoogleTask.id,
      },
      data: {
        plannerItems: {
          connect: plannerItemIds,
        },
        updatedAt: new Date(),
      },
    }),
  ]);
};
