import * as trpcNext from '@trpc/server/adapters/next';
import * as trpc from '@trpc/server';
import { getSession } from 'next-auth/react';
import { Maybe } from '@trpc/server';
import { Session } from 'next-auth';
import { GetServerSidePropsContext } from 'next';
import { prisma } from './prisma';
import { gqlClient, gqlSdk } from '@/lib/gqlSdk';
import { canvasAxios } from '@/lib/axios';

type CreateContextOptions = trpcNext.CreateNextContextOptions | GetServerSidePropsContext;

const getUserFromSession = async ({
  session,
}: {
  session: Maybe<Session>;
  req: CreateContextOptions['req'];
}) => {
  if (!session?.user?.id) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id || '',
    },
    select: {
      id: true,
      email: true,
      name: true,
      canvasToken: true,
      credentials: {
        select: {
          id: true,
          type: true,
          key: true,
        },
      },
    },
  });

  if (!user) {
    return null;
  }

  return user;
};
/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export const createContext = async ({ req, res }: trpcNext.CreateNextContextOptions) => {
  // for API-response caching see https://trpc.io/docs/caching

  const session = await getSession({ req });

  const user = await getUserFromSession({ session, req });

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
    user,
  };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
