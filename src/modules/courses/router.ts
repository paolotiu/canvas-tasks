import { createRouter } from 'src/server/createRouter';
import { ClientError } from 'graphql-request';
import { GQLRequestError } from '@/modules/common/types';

export const coursesRouter = createRouter().query('courses', {
  resolve: async ({ ctx: { gqlSdk, session } }) => {
    try {
      const { status, data } = await gqlSdk.AllCourses();

      if (status === 401 || !data) {
        return 'asdksald';
      }
      return data;
    } catch (error) {
      if (error instanceof ClientError) {
        return error.response.status;
      }
    }
  },
});
