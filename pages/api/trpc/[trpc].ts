import * as trpcNext from '@trpc/server/adapters/next';
import { appRouter } from 'server';
import { createContext } from 'server/context';
// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext,
});
