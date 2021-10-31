import { z } from 'zod';
import { createRouter } from '@/server/createRouter';
import { updateTasklist } from './updateTasklist';
import { getNewPlannerItems } from '../utils/getNewPlannerItems';
import { filterPlannerItems } from '../utils/filterPlannerItems';
import { isCredentialWithConnectedGoogleTask } from '../utils/isConnectedGoogleTask';

export const googletasksRouter = createRouter()
  .mutation('sync', {
    input: z.object({
      integrationId: z.string(),
    }),
    resolve: async ({ ctx: { session, prisma }, input: { integrationId } }) => {
      if (!session?.user?.id) {
        return {
          message: 'Not authenticated',
        };
      }

      const credential = await prisma.credential.findUnique({
        where: {
          id_userId: {
            id: integrationId,
            userId: session.user.id,
          },
        },
        include: {
          connectedGoogleTask: true,
        },
      });

      if (!credential) {
        return {
          message: `No integration with the ID of ${integrationId} found`,
        };
      }
      if (!isCredentialWithConnectedGoogleTask(credential)) {
        return {
          message: 'No connected google task',
        };
      }

      const plannerItems = filterPlannerItems({
        connectedGoogleTask: credential.connectedGoogleTask,
        plannerItems: await getNewPlannerItems({
          connectedGoogleTaskId: credential.connectedGoogleTask.id,
        }),
      });

      await updateTasklist({ credential, plannerItems });

      return {
        message: 'Successfully updated',
      };
    },
  })
  .mutation('updateConfig', {
    input: z.object({
      includeAssignments: z.boolean().optional(),
      includeDiscussionTopics: z.boolean().optional(),
      includeQuizzes: z.boolean().optional(),
      integrationId: z.string(),
    }),
    resolve: async ({ ctx: { session, prisma }, input }) => {
      const { integrationId, ...fields } = input;
      await prisma.connectedGoogleTask.update({
        where: {
          userId_integrationId: {
            integrationId: input.integrationId,
            userId: session?.user?.id || '',
          },
        },
        data: {
          ...fields,
        },
      });

      return {
        message: 'Updated successfully!',
      };
    },
  });
