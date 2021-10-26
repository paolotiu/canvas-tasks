import { google } from 'googleapis';
import type { NextApiHandler } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '@/server/prisma';

const credentials = process.env.GOOGLE_API_CREDENTIALS;

export const handler: NextApiHandler = async (req, res) => {
  const { code } = req.query;
  const session = await getSession({ req });

  if (!session?.user?.id) {
    res.status(401).json({ message: 'You must be logged in to do this' });
    return;
  }
  if (typeof code !== 'string') {
    res.status(400).json({ message: '`code` must be a string' });
    return;
  }
  if (!credentials) {
    res.status(400).json({ message: 'There are no Google Credentials installed.' });
    return;
  }

  const { client_secret, client_id } = JSON.parse(credentials).web;
  const redirect_uri = process.env.BASE_URL + '/api/integrations/googletasks/callback';

  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uri);
  const token = await oAuth2Client.getToken(code);

  const key = token.res?.data;

  const { id } = await prisma.credential.create({
    data: {
      type: 'google_tasks',
      key,
      userId: session.user.id,
    },
  });

  await prisma.selectedTaskTypes.create({
    data: {
      integrationId: id,
      userId: session.user.id,
    },
  });

  res.redirect('/integrations');
};

export default handler;
