/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { z } from 'zod';
import { google } from 'googleapis';
import { createRouter } from '@/server/createRouter';
import { googleAuth } from './utils/googleAuth';
import { googletasksRouter } from './googletasks/router';

export const integrationsRouter = createRouter()
  .query('integrations', {
    resolve: async ({ ctx: { prisma, user } }) => {
      const integrations = await prisma.credential.findMany({
        where: {
          userId: user?.id || '',
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
    resolve: async ({ ctx: { prisma, user }, input }) => {
      await prisma.credential.delete({
        where: {
          id_userId: {
            id: input.integrationId,
            userId: user?.id || '',
          },
        },
      });

      return {
        message: 'Deleted integration successfully',
      };
    },
  })
  .query('sync', {
    resolve: async () => {
      // const users = await prisma.user.findMany({
      //   include: {
      //     credentials: {
      //       include: {
      //         connectedGoogleTask: true,
      //       },
      //     },
      //   },
      // });
      // for (const user of users) {
      //   const { canvasToken, credentials } = user;
      //   canvasAxios.defaults.headers.common.Authorization = `Bearer ${canvasToken}`;
      //   const { data: plannerItems } = await listPlannerItems({
      //     per_page: 100,
      //     start_date: new Date(),
      //   });
      //   const existingPlannerItems = await prisma.plannerItem.findMany({
      //     where: {
      //       id: {
      //         in: plannerItems.map((item) => String(item.plannable_id)),
      //       },
      //     },
      //     include: {
      //       connectedGoogleTasks: true,
      //     },
      //   });
      //   for (const credential of credentials) {
      //     if (credential.type === 'google_tasks') {
      //       if (!isCredentialWithConnectedGoogleTask(credential)) return;
      //       const existingPlannerItemsMap = existingPlannerItems.reduce<{
      //         [key: string]: typeof existingPlannerItems[0];
      //       }>((obj, item) => Object.assign(obj, { [item.id]: item }), {});
      //       const np = plannerItems.reduce<PlannerItemList>((arr, item) => {
      //         const existing = existingPlannerItemsMap[item.plannable_id];
      //         if (existing && existing.updatedAt !== new Date(item.plannable.updated_at)) {
      //           console.log('hey');
      //           return [
      //             ...arr,
      //             { ...item, connectedGoogleTaskId: existing.connectedGoogleTasks[0].id },
      //           ];
      //         }
      //         return arr;
      //       }, []);
      //       // const newPlannerItems = differenceWith(plannerItems, existingPlannerItems, (a, b) => {
      //       //   return (
      //       //     String(a.plannable_id) === b.id &&
      //       //     b.connectedGoogleTasks.some((c) => c.id === credential.connectedGoogleTask?.id)
      //       //   );
      //       // });
      //       // await updateTasklist({
      //       //   credential,
      //       //   plannerItems: newPlannerItems,
      //       // });
      //     }
      //   }
    },
  })
  .merge('googletasks.', googletasksRouter);
