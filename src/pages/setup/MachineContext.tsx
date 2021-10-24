import { createContext, useContext } from 'react';
import { InterpreterFrom } from 'xstate';
import { setupMachine } from '@/modules/setup/machine';

export const MachineContext = createContext<{
  setupService: InterpreterFrom<typeof setupMachine>;
} | null>(null);

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const useSetupService = () => {
  const val = useContext(MachineContext);
  if (val === null) {
    throw new Error('No context in the tree');
  }

  return val.setupService;
};
// export const MachineContextProvider = ({ children }: { children: React.ReactNode }) => {
//   const setupService = useInterpret(setupMachine);
//   return <MachineContext.Provider value={{ setupService }}>{children}</MachineContext.Provider>;
// };
