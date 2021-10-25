import * as trpcNext from '@trpc/server/adapters/next';
import * as trpc from '@trpc/server';
import { getSession } from 'next-auth/react';
import { prisma } from './prisma';
import { gqlClient, gqlSdk } from '@/lib/gqlSdk';
import { canvasAxios } from '@/lib/axios';

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export const createContext = async ({ req, res }: trpcNext.CreateNextContextOptions) => {
  // for API-response caching see https://trpc.io/docs/caching

  const session = await getSession({ req });

  if (session?.user?.canvasToken) {
    gqlClient.setHeader('Authorization', `Bearer ${session?.user?.canvasToken}`);

    canvasAxios.defaults.headers.common.Authorization = `Bearer ${session.user.canvasToken}`;
  }
  return {
    req,
    res,
    prisma,
    session,
    gqlSdk,
    canvasAxios,
  };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
