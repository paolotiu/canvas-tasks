import { createRouter } from 'src/server/createRouter';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { canvasAxios } from '@/lib/axios';
import { RESTSelf } from '../common/types';

export const setupRouter = createRouter()
  .query('verifyToken', {
    input: (token: unknown) => {
      if (typeof token === 'string') return token;
      throw new Error(`Invalid input: ${typeof token}`);
    },
    resolve: async ({ input }) => {
      try {
        const { data } = await canvasAxios.get<RESTSelf>('/users/self', {
          headers: {
            authorization: `Bearer ${input}`,
          },
        });

        return data;
      } catch (error) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid Token',
        });
      }
    },
  })
  .mutation('setCanvasToken', {
    input: z.object({
      token: z.string(),
      userId: z.string(),
    }),
    resolve: async ({ ctx: { prisma }, input: { token, userId } }) => {
      try {
        await canvasAxios.get<RESTSelf>('/users/self', {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        const user = await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            canvasToken: token,
          },
        });

        return user;
      } catch (error) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid Token',
        });
      }
    },
  });
