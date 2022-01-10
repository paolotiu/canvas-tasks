import { createRouter } from 'src/server/createRouter';

import { z } from 'zod';
import { RESTCourseModule } from '../common/types';

export const coursesRouter = createRouter()
  .query('courses', {
    resolve: async ({ ctx: { gqlSdk } }) => {
      try {
        const { status, data } = await gqlSdk.AllCourses();

        if (status === 401 || !data) {
          return {};
        }
        return data;
      } catch (error) {
        return {};
      }
    },
  })
  .query('modules', {
    input: z.object({
      id: z.string(),
    }),
    resolve: async ({ ctx: { canvasAxios }, input: { id } }) => {
      const res = await canvasAxios.get<RESTCourseModule[]>(`/courses/${id}/modules`, {
        params: {
          include: ['items', 'content_details'],
        },
      });

      return res.data;
    },
  });
