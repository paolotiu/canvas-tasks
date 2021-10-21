import { google } from 'googleapis';

export const tasks = google.tasks({
  version: 'v1',
  auth: process.env.GOOGLE_API_KEY,
});
