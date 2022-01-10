export * from './trpc';
export * from './courseModule';
export * from './planner';
export * from './self';

export interface GQLRequestError {
  response: {
    status: number;
    error: Array<{
      message: string;
    }>;
  };
}
