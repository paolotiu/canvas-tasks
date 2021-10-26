import { tasksRouter } from 'src/modules/tasks';
import { setupRouter } from 'src/modules/setup';
import { createRouter } from './createRouter';
import { coursesRouter } from '@/modules/courses/router';
import { announcementsRouter } from '@/modules/announcements';
import { integrationsRouter } from '@/modules/integrations';

export const appRouter = createRouter()
  .merge(tasksRouter)
  .merge(setupRouter)
  .merge(coursesRouter)
  .merge(announcementsRouter)
  .merge(integrationsRouter);

// only export *type signature* of router!
// to avoid accidentally importing your API
// into client-side code
export type AppRouter = typeof appRouter;
