import { Auth } from 'googleapis';

import { prisma } from '@/server/prisma';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { google } = require('googleapis');

/**
 *
 * @param credential Credential
 * @returns
 */
export const googleAuth = (credential: any) => {
  if (!credential) return;
  const { client_secret, client_id, redirect_uris } = JSON.parse(
    process.env.GOOGLE_API_CREDENTIALS
  ).web;
  const myGoogleAuth = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
  myGoogleAuth.setCredentials(credential.key as any);

  // We're accessing a protected method
  const isExpired = () => myGoogleAuth.isTokenExpiring();

  const refreshAccessToken = () =>
    myGoogleAuth
      .refreshToken((credential.key as any).refresh_token as string)
      .then((res: any) => {
        const token = res.res.data;

        credential.key.access_token = token.access_token;
        credential.key.expiry_date = token.expiry_date;
        return prisma.credential
          .update({
            where: {
              id: credential.id,
            },
            data: {
              key: credential.key,
            },
          })
          .then(() => {
            myGoogleAuth.setCredentials(credential.key);
            return myGoogleAuth;
          });
      })
      .catch((err: any) => {
        console.error('Error refreshing google token', err);
        return myGoogleAuth;
      });

  return {
    getToken: () =>
      (!isExpired()
        ? Promise.resolve(myGoogleAuth)
        : refreshAccessToken()) as Promise<Auth.OAuth2Client>,
  };
};
