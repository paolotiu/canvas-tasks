import * as trpcNext from '@trpc/server/adapters/next';
import { appRouter } from 'src/server';
import { createContext } from 'src/server/context';
// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext,
  // onError: ({ error }) => {
  //   console.log(error.message);
  // },
  responseMeta: ({ ctx, paths, type, errors }) => {
    const isModules = paths && paths.every((path) => path.includes('modules'));
    // checking that no procedures errored
    const allOk = errors.length === 0;
    // checking we're doing a query request
    const isQuery = type === 'query';
    if (ctx?.res && isModules && allOk && isQuery) {
      // cache request for 1 day + revalidate once every second
      const ONE_DAY_IN_SECONDS = 60 * 60 * 24;
      return {
        headers: {
          'cache-control': `s-maxage=1, stale-while-revalidate=${ONE_DAY_IN_SECONDS}`,
        },
      };
    }
    return {};
  },
});
