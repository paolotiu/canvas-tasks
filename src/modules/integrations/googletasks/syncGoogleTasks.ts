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
    })
  );
};
