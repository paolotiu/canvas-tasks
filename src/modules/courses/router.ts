import { createRouter } from 'src/server/createRouter';
import { ClientError } from 'graphql-request';

export const coursesRouter = createRouter().query('courses', {
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
});
