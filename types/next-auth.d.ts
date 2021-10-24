/* eslint-disable @typescript-eslint/no-empty-interface */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from 'next-auth';
import { User as PrismaUser } from '@prisma/client';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user?: {
      /** The user's postal address. */
      name: string;
      email: string;
      image: string;
      id: string;
      canvasToken: string | null;
    };

    accessToken?: string;
  }

  interface User extends PrismaUser {}
}
