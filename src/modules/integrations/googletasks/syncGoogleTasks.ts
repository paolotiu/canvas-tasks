import { google } from 'googleapis';
import { differenceWith } from 'lodash-es';
import { prisma } from '@/server/prisma';
import { googleAuth } from '../utils/googleAuth';
import { listPlannerItems } from '@/modules/common';

export const syncGoogleTasks = async (userId: string) => {
  /**
   * Step 1. Find user and their credentials and connectedGoogleTask
   */
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      credentials: {
        include: {
          connectedGoogleTask: true,
        },
      },
    },
  });

  if (!user) {
    return;
  }

  /**
   * Step 2. Get all upcoming planner items
   */
  const { data: plannerItems } = await listPlannerItems({
    per_page: 100,
    start_date: new Date(),
  });

  const plannerItemsId = plannerItems.map((item) => String(item.plannable_id));

  /**
   *
   *
   *
   * Step 3. Loop through the credentials
   *
   *
   *
   *
   */
  await Promise.all(
    user.credentials.map(async (credential) => {
      const { connectedGoogleTask } = credential;
      /**
       * Step 4. Get all planner items that we already recorded
       */
      const existingPlannerItems = await prisma.plannerItem.findMany({
        where: {
          id: {
            in: plannerItemsId,
          },
          connectedGoogleTasks: {
            some: {
              id: credential.connectedGoogleTask?.id,
            },
          },
        },
      });

      /**
       * Step 5. Diff to only get new planner items
       */
      const newPlannerItems = differenceWith(plannerItems, existingPlannerItems, (a, b) => {
        return String(a.plannable_id) === b.id;
      });

      /**
       * Step 6. Get google oauth client
       */
      const gAuth = await googleAuth(credential)?.getToken();
      if (!gAuth || !credential.connectedGoogleTask) {
        return;
      }

      const tasksService = google.tasks({
        version: 'v1',
        auth: gAuth,
      });

      let tasklistId = credential.connectedGoogleTask.connectedTaskId;

      /**
       * Step 7. Check if tasklist exists, if not create a new one
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

      const sortedPlannerItems = newPlannerItems
        .filter((item) => {
          if (item.plannable_type === 'assignment' && connectedGoogleTask?.includeAssignments) {
            return true;
          }

          if (
            item.plannable_type === 'discussion_topic' &&
            connectedGoogleTask?.includeDiscussionTopics
          ) {
            return true;
          }

          if (item.plannable_type === 'quiz' && connectedGoogleTask?.includeQuizzes) {
            return true;
          }

          return false;
        })
        .sort((a, b) => {
          // Sort by due date (desc)
          // Nearer due dates at the top
          const dateA = a.plannable.due_at ? new Date(a.plannable.due_at).getTime() : Infinity;
          const dateB = b.plannable.due_at ? new Date(b.plannable.due_at).getTime() : Infinity;
          return dateA < dateB ? 1 : -1; // ? -1 : 1 for ascending/increasing order
        });
      // /**
      //  * Step 8. Add planner items to google task
      //  */

      Promise.all(
        sortedPlannerItems.map(async (item) => {
          await tasksService.tasks.insert({
            tasklist: tasklistId,
            requestBody: {
              title: item.plannable.title,
              due: item.plannable.due_at?.toString(),
              notes: `${item.context_name}`,
            },
          });
        })
      );

      /**
       * Step 9. Update recorded planner items
       */
      await prisma.plannerItem.createMany({
        data: plannerItems.map((item) => ({ id: String(item.plannable_id) })),
        skipDuplicates: true,
      });

      await prisma.$transaction(
        newPlannerItems.map((item) =>
          prisma.plannerItem.upsert({
            where: {
              id: String(item.plannable_id),
            },
            create: {
              id: String(item.plannable_id),
              connectedGoogleTasks: {
                connect: {
                  id: connectedGoogleTask?.id,
                },
              },
            },
            update: {
              connectedGoogleTasks: {
                connect: {
                  id: connectedGoogleTask?.id,
                },
              },
            },
          })
        )
      );
    })
  );
};
