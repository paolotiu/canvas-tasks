import { GraphQLClient } from 'graphql-request';
import { getSdk } from '@/generated/graphql';

export const gqlClient = new GraphQLClient('https://ateneo.instructure.com/api/graphql');

export const gqlSdk = getSdk(gqlClient);
