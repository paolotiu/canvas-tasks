import { z } from 'zod';
import { createRouter } from '@/server/createRouter';
import { syncGoogleTasks } from './syncGoogleTasks';

export const googletasksRouter = createRouter().mutation('sync', {
  input: z.object({}).nullish(),
  resolve: async ({ ctx: { session } }) => {
    console.log(session);
    if (!session?.user?.id) {
      return {
        message: 'Not authenticated',
      };
    }

    await syncGoogleTasks(session.user.id);

    return {
      message: 'Successfully synced',
    };
  },
});
