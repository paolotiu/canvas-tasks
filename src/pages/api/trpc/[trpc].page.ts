import * as trpcNext from '@trpc/server/adapters/next';
import { appRouter } from 'src/server';
import { createContext } from 'src/server/context';
// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext,
  onError: ({ error }) => {
    console.log(error.message);
  },
});