import { createModel } from 'xstate/lib/model';

const setupModel = createModel(
  {
    canvasToken: '',
    hasFinishedToken: false,
  },
  {
    events: {
      verified: () => ({}),
      updateToken: (canvasToken: string) => ({ canvasToken }),
    },
  }
);

const updateTokenAction = setupModel.assign(
  {
    canvasToken: (_, e) => e.canvasToken,
    hasFinishedToken: (_, e) => !!e.canvasToken,
  },
  'updateToken'
);

export const setupMachine = setupModel.createMachine(
  {
    id: 'setup',
    initial: 'initialising',

    states: {
      initialising: {
        on: {
          updateToken: [{ actions: updateTokenAction, target: 'idle' }],
        },
      },
      idle: {
        always: [
          { target: 'verifyToken', cond: 'doesNotHaveCanvasToken' },
          {
            target: 'finished',
            cond: 'hasCanvasToken',
          },
        ],
        on: {
          updateToken: {
            actions: updateTokenAction,
          },
        },
      },
      verifyToken: {
        on: {
          verified: 'finished',
          updateToken: {
            actions: updateTokenAction,
            target: 'idle',
          },
        },
      },
      finished: {},
    },
  },
  {
    guards: {
      hasCanvasToken: (ctx) => {
        return !!ctx.canvasToken;
      },
      doesNotHaveCanvasToken: (ctx) => {
        return !ctx.canvasToken;
      },
    },
  }
);
