import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { withTRPC } from '@trpc/next';
import { AppRouter } from 'src/server';
import { IdProvider } from '@radix-ui/react-id';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { inspect } from '@xstate/inspect';
import globalStyles from '@/styles/globalStyles';

function MyApp({ Component, pageProps }: AppProps) {
  globalStyles();
  return (
    <SessionProvider session={pageProps.session}>
      <IdProvider>
        <Component {...pageProps} />
      </IdProvider>
    </SessionProvider>
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
      queryClientConfig: { defaultOptions: { queries: { staleTime: 1000 * 10 } } },
      headers: {
        cookie: ctx?.req?.headers.cookie,
      },
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: true,
})(MyApp);