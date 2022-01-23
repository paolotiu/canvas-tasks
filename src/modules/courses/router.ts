import { createRouter } from 'src/server/createRouter';

import { z } from 'zod';
import { RESTCourseModule } from '../common/types';
import { RESTCanvasCourse } from '../common/types/courses';
import { RESTModuleItem, RESTModuleItemWithType } from '../common/types/moduleItem';

export const coursesRouter = createRouter()
  .query('courses', {
    resolve: async ({ ctx: { canvasAxios } }) => {
      const { data } = await canvasAxios.get<RESTCanvasCourse[]>('/courses', {
        params: {
          include: ['term', 'course_image'],
        },
      });

      return data.reduce((acc, curr) => {
        if (!curr.term) {
          return acc;
        }
        // Do not include ended courses
        if (!curr.term.end_at || new Date(curr.term.end_at).getTime() > new Date().getTime()) {
          return [...acc, curr];
        }
        return acc;
      }, [] as RESTCanvasCourse[]);
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
  })
  .query('moduleItem', {
    input: z.object({
      type: z.enum([
        'assignments',
        'discussion_topics',
        'files',
        'pages',
        'quizzes',
        'external_tools',
      ]),
      slug: z.string(),
      courseId: z.string(),
    }),
    resolve: async ({ ctx: { canvasAxios, res: _res }, input: { type, slug, courseId } }) => {
      const res = await canvasAxios.get<RESTModuleItem>(`/courses/${courseId}/${type}/${slug}`);

      _res.setHeader('cache-control', 'max-age=10');
      return {
        ...res.data,
        type,
      } as RESTModuleItemWithType;
    },
  });
