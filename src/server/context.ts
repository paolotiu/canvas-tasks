import * as trpcNext from '@trpc/server/adapters/next';
import * as trpc from '@trpc/server';
import { GetServerSidePropsContext } from 'next';
import { Prisma } from '@prisma/client';
import { prisma } from './prisma';
import { gqlClient, gqlSdk } from '@/lib/gqlSdk';
import { canvasAxios } from '@/lib/axios';
import { auth } from '@/lib/supabase';

type CreateContextOptions = trpcNext.CreateNextContextOptions | GetServerSidePropsContext;

type UserDetails = {
  id: string;
  canvasToken: string | null;
  email: string | null;
  credentials: {
    id: string;
    type: string;
    key: Prisma.JsonValue;
  }[];
};

export const getUserDetails = async ({ userId }: { userId: string }) => {
  const userDetails = await prisma.user.findUnique({
    where: {
      id: userId,
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
export const createContext = async ({
  req,
  res,
  user: providedUser,
}: CreateContextOptions & { user?: UserDetails }) => {
  // for API-response caching see https://trpc.io/docs/caching
  let user: UserDetails | null | undefined = providedUser;

  if (!user) {
    const { data } = await auth.api.getUserByCookie(req);

    if (data?.id) {
      user = await getUserDetails({ userId: data.id });
    }
  }

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
