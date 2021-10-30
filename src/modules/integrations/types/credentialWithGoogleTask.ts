import { ConnectedGoogleTask } from '@prisma/client';

export type CredentialWithConnectedGoogleTask = Credential & {
  connectedGoogleTask: ConnectedGoogleTask;
};

export type CredentialWithoutConnectedGoogleTask = Credential & {
  connectedGoogleTask: null;
};
