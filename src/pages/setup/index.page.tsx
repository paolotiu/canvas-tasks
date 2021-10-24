import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useInterpret, useSelector } from '@xstate/react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/Accordion';
import Token from './_Token';
import { setupMachine } from '@/modules/setup/machine';
import { MachineContext } from './MachineContext';

const ids = ['a-1', 'a-2', 'a-3'];

const ValueMap: Record<string, string> = {
  verifyToken: ids[0],
};
const Setup = () => {
  const { data, status } = useSession();
  const setupService = useInterpret(setupMachine);
  const currentValue = useSelector(setupService, (state) => state.value.toString());

  useEffect(() => {
    if (status !== 'loading') {
      setupService.send('updateToken', { canvasToken: data?.user?.canvasToken || '' });
    }
  }, [data?.user?.canvasToken, setupService, status]);

  return (
    <MachineContext.Provider value={{ setupService }}>
      <main tw="grid min-h-screen bg-slate2 place-items-center">
        <div tw="flex flex-col  items-center mb-80">
          <h1 tw="mb-10 text-3xl font-bold">Let&apos;s get you set up!</h1>
          <Accordion
            type="single"
            defaultValue={ids[0]}
            collapsible
            value={ValueMap[currentValue] || ''}
          >
            <AccordionItem value={ids[0]}>
              <AccordionTrigger>Enter your Canvas API Token </AccordionTrigger>
              <Token />
            </AccordionItem>

            <AccordionItem value={ids[1]}>
              <AccordionTrigger>Can it be animated?</AccordionTrigger>
              <AccordionContent>
                Yes! You can animate the Accordion with CSS or JavaScript.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </main>
    </MachineContext.Provider>
  );
};

// export const getServerSideProps: GetServerSideProps = () => {};
export default Setup;
