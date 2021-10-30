import { z } from 'zod';
import { google } from 'googleapis';
import { createRouter } from '@/server/createRouter';
import { googleAuth } from './utils/googleAuth';
import { googletasksRouter } from './googletasks/router';

export const integrationsRouter = createRouter()
  .query('integrations', {
    resolve: async ({ ctx: { session, prisma, user } }) => {
      const integrations = await prisma.credential.findMany({
        where: {
          userId: session?.user?.id,
        },
        select: {
          id: true,
          type: true,
          key: true,

          connectedGoogleTask: {
            select: {
              includeAssignments: true,
              includeDiscussionTopics: true,
              includeQuizzes: true,
              updatedAt: true,
            },
          },
        },
      });

      const integrationsWithEmail = await Promise.all(
        integrations.map(async (item) => {
          const gAuth = await googleAuth(item)?.getToken();

          if (gAuth) {
            const {
              data: { email },
            } = await google.oauth2('v2').userinfo.get({
              auth: gAuth,
            });

            return {
              ...item,
              email,
            };
          }

          return {
            ...item,
            email: user?.email,
          };
        })
      );

      return integrationsWithEmail;
    },
  })
  .mutation('deleteIntegration', {
    input: z.object({
      integrationId: z.string(),
    }),
    resolve: async ({ ctx: { prisma, session }, input }) => {
      await prisma.credential.delete({
        where: {
          id_userId: {
            id: input.integrationId,
            userId: session?.user?.id || '',
          },
        },
      });

      return {
        message: 'Deleted integration successfully',
      };
    },
  })
  .mutation('updateTaskConfig', {
    input: z.object({
      includeAssignments: z.boolean().optional(),
      includeDiscussionTopics: z.boolean().optional(),
      includeQuizzes: z.boolean().optional(),
      integrationId: z.string(),
    }),
    resolve: async ({ ctx: { session, prisma }, input }) => {
      const { integrationId, ...fields } = input;
      await prisma.connectedGoogleTask.update({
        where: {
          userId_integrationId: {
            integrationId: input.integrationId,
            userId: session?.user?.id || '',
          },
        },
        data: {
          ...fields,
        },
      });

      return {
        message: 'Updated successfully!',
      };
    },
  })
  .merge('googletasks.', googletasksRouter);
