import NextAuth from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import GoogleProvider from 'next-auth/providers/google';
import { prisma } from 'src/server/prisma';

export default NextAuth({
  adapter: PrismaAdapter(prisma),

  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],

  callbacks: {
    session: async ({ user, session }) => {
      if (session.user) {
        session.user.id = user.id;
        session.user.canvasToken = user.canvasToken;
      }
      return session;
    },
  },
  secret: process.env.JWT_SECRET,
  jwt: {},
});
