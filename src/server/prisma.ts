/* eslint-disable no-var */
/* eslint-disable vars-on-top */
import { PrismaClient } from '@prisma/client';

// declare global {
//   var prisma: PrismaClient | undefined;
// }

export const prisma =
  ((global as any).prisma as PrismaClient) ||
  new PrismaClient({
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') (global as any).prisma = prisma;
