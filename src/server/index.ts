import { useAQuery } from 'src/generated/graphql';
import { google } from 'googleapis';
import { getSession } from 'next-auth/react';
import { tasksRouter } from 'src/modules/tasks';
import { setupRouter } from 'src/modules/setup';
import { createRouter } from './createRouter';
import { coursesRouter } from '@/modules/courses/router';
import { announcementsRouter } from '@/modules/announcements';

const tasksService = google.tasks({
  version: 'v1',
  auth: process.env.GOOGLE_API_KEY,
});

const assignments = createRouter()
  .query('ass', {
    resolve: async () => {
      const data = await useAQuery.fetcher()();
      return data;
    },
  })
  .query('tasks', {
    resolve: async ({ ctx: { req } }) => {
      const session = await getSession({ req });
      const tasklist = await tasksService.tasklists.list({
        access_token: session?.accessToken,
      });

      return tasklist.data.items;
    },
  })
  .query('a', {
    resolve: async ({ ctx: { req } }) => {
      const session = await getSession({ req });

      console.log(session);
      return 'hi';
    },
  });

export const appRouter = createRouter()
  .merge(assignments)
  .merge(tasksRouter)
  .merge(setupRouter)
  .merge(coursesRouter)
  .merge(announcementsRouter);

// only export *type signature* of router!
// to avoid accidentally importing your API
// into client-side code
export type AppRouter = typeof appRouter;
