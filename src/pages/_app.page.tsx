import type { AppProps } from 'next/app';
import { withTRPC } from '@trpc/next';
import { AppRouter } from 'src/server';
import { IdProvider } from '@radix-ui/react-id';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { inspect } from '@xstate/inspect';
import { httpBatchLink } from '@trpc/client/links/httpBatchLink';
import { httpLink } from '@trpc/client/links/httpLink';
import { splitLink } from '@trpc/client/links/splitLink';
import globalStyles from '@/styles/globalStyles';
import Protected from '@/components/Auth/Protected';
import { UserContextProvider } from '@/lib/auth/useUser';

function MyApp({ Component, pageProps }: AppProps) {
  globalStyles();

  return (
    <IdProvider>
      <UserContextProvider>
        {(Component as any).auth ? (
          <Protected>
            <Component {...pageProps} />
          </Protected>
        ) : (
          <Component {...pageProps} />
        )}
      </UserContextProvider>
    </IdProvider>
  );
}

// if (typeof window !== 'undefined') {
//   inspect({
//     iframe: false,
//   });
// }

export default withTRPC<AppRouter>({
  config({ ctx }) {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    const url = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}/api/trpc`
      : 'http://localhost:3000/api/trpc';

    return {
      url,
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 1000 * 10 } } },
      headers: {
        cookie: ctx?.req?.headers.cookie,
      },
      links: [
        splitLink({
          condition(op) {
            return op.context.skipBatch === true;
          },
          true: httpLink({
            url,
          }),
          // when condition is false, use batching
          false: httpBatchLink({
            url,
          }),
        }),
      ],
    };
  },

  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: true,
})(MyApp);
