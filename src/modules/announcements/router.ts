import { z } from 'zod';
import { createRouter } from '@/server/createRouter';
import { getAnnnouncements } from './getAnnnouncements';
import { RESTCanvasAnnouncement } from '../common/types/announcements';

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
    resolve: async ({ ctx: { gqlSdk, canvasAxios } }) => {
      const { data: coursesData } = await gqlSdk.allCoursesIdCode();

      // const announcements = await Promise.all(
      //   coursesData?.allCourses?.map(async ({ _id }) => {
      //     const { data } = await getAnnnouncements(_id);
      //     return data;
      //   }) || []
      // );

      // Cache for 5 mins
      const contextCodeMap = coursesData?.allCourses?.reduce(
        (acc, curr) => ({ ...acc, [`course_${curr._id}`]: curr.courseCode }),
        {} as Record<string, string | null | undefined>
      );
      const contextCodes = Object.keys(contextCodeMap || {});

      const { data } = await canvasAxios.get<RESTCanvasAnnouncement[]>('/announcements', {
        params: {
          context_codes: contextCodes,
        },
      });

      return data.map((ann) => {
        return {
          ...ann,
          courseCode: contextCodeMap?.[ann.context_code] || '',
        };
      });
    },
  });
