import { CredentialWithoutConnectedGoogleTask, CredentialWithConnectedGoogleTask } from '../types';

export const isCredentialWithConnectedGoogleTask = (
  credential: CredentialWithConnectedGoogleTask | CredentialWithoutConnectedGoogleTask
): credential is CredentialWithConnectedGoogleTask => {
  return !!credential.connectedGoogleTask;
};
