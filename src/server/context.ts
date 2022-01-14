import * as trpcNext from '@trpc/server/adapters/next';
import * as trpc from '@trpc/server';
import { Maybe } from '@trpc/server';
import { GetServerSidePropsContext } from 'next';
import { User } from '@supabase/supabase-js';
import { prisma } from './prisma';
import { gqlClient, gqlSdk } from '@/lib/gqlSdk';
import { canvasAxios } from '@/lib/axios';
import { auth } from '@/lib/supabase';

type CreateContextOptions = trpcNext.CreateNextContextOptions | GetServerSidePropsContext;

const getUserDetails = async ({
  user,
}: {
  user: Maybe<User>;
  req: CreateContextOptions['req'];
}) => {
  if (!user?.id) {
    return null;
  }

  const userDetails = await prisma.user.findUnique({
    where: {
      id: user.id || '',
    },
    select: {
      id: true,
      canvasToken: true,
      email: true,
      credentials: {
        select: {
          id: true,
          type: true,
          key: true,
        },
      },
    },
  });

  if (!userDetails) {
    return null;
  }

  return userDetails;
};
/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export const createContext = async ({ req, res }: trpcNext.CreateNextContextOptions) => {
  // for API-response caching see https://trpc.io/docs/caching

  const { data } = await auth.api.getUserByCookie(req);

  const user = await getUserDetails({ user: data, req });

  if (user?.canvasToken) {
    gqlClient.setHeader('Authorization', `Bearer ${user?.canvasToken}`);
    canvasAxios.defaults.headers.common.Authorization = `Bearer ${user.canvasToken}`;
  }
  return {
    req,
    res,
    prisma,
    gqlSdk,
    canvasAxios,
    user,
  };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
