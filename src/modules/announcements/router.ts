import { z } from 'zod';
import { createRouter } from '@/server/createRouter';
import { getAnnnouncements } from './getAnnnouncements';

export const announcementsRouter = createRouter()
  .query('announcements', {
    input: z.object({
      courseId: z.number(),
    }),
    resolve: async ({ input: { courseId } }) => {
      const { data } = await getAnnnouncements(courseId);
      return data;
    },
  })
  .query('allAnnouncements', {
    resolve: async ({ ctx: { gqlSdk, res } }) => {
      const { data: coursesData } = await gqlSdk.allCoursesId();

      const announcements = await Promise.all(
        coursesData?.allCourses?.map(async ({ _id }) => {
          const { data } = await getAnnnouncements(_id);
          return data;
        }) || []
      );

      // Cache for 5 mins
      res.setHeader('cache-control', 'private, max-age=300');

      const sorted = announcements.flat().sort((a, b) => {
        const dateA = new Date(a.posted_at).getTime();
        const dateB = new Date(b.posted_at).getTime();
        return dateA < dateB ? 1 : -1; // ? -1 : 1 for ascending/increasing order
      });

      return sorted;
    },
  });
