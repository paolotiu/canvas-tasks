import { z } from 'zod';
import { createRouter } from '@/server/createRouter';
import { updateTasklist } from './updateTasklist';
import { getNewPlannerItems } from '../utils/getNewPlannerItems';
import { filterPlannerItems } from '../utils/filterPlannerItems';
import { CredentialWithConnectedGoogleTask, CredentialWithoutConnectedGoogleTask } from '../types';

const isCredentialWithConnectedGoogleTask = (
  credential: CredentialWithConnectedGoogleTask | CredentialWithoutConnectedGoogleTask
): credential is CredentialWithConnectedGoogleTask => {
  return !!credential.connectedGoogleTask;
};
export const googletasksRouter = createRouter().mutation('sync', {
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
});
