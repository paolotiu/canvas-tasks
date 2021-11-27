import { createRouter } from 'src/server/createRouter';
import { listPlannerItems } from './queries/listPlannerItems';

export const tasksRouter = createRouter().query('planner', {
  resolve: async () => {
    // const session = await getSession({ req });

    const { data } = await listPlannerItems({
      start_date: new Date(),
      per_page: 1,
    });

    // const list = await tasks.tasklists.list({
    //   access_token: session?.accessToken,
    // });

    // if (list.data.items) {
    //   const { id } = list.data.items[0];

    //   if (id) {
    //     await tasks.tasks.insert({
    //       access_token: session?.accessToken,
    //       requestBody: {
    //         title: data[0].plannable.title,
    //         due: data[0].plannable.due_at.toString(),
    //       },
    //       tasklist: id,
    //     });
    //   }
    // }

    return data;
  },
});
