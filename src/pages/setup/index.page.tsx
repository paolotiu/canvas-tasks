import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useInterpret, useSelector } from '@xstate/react';
import { FiCheck } from 'react-icons/fi';
import { styled } from 'twin.macro';
import { keyframes } from '@stitches/react';
import { useRouter } from 'next/dist/client/router';
import { Accordion, AccordionItem, AccordionTrigger } from '@/components/Accordion';
import Token from './_Token';
import { setupMachine } from '@/modules/setup/machine';
import { MachineContext } from './MachineContext';
import Confetti from '@/components/Confetti/Confetti';

const ids = ['a-1', 'a-2', 'a-3'];

const ValueMap: Record<string, string> = {
  verifyToken: ids[0],
};

const draw = keyframes({
  from: {
    strokeDashoffset: -23,
  },
  to: {
    strokeDashoffset: 0,
  },
});
const StyledCheckIcon = styled(FiCheck, {
  '[data-state=closed] &': {
    polyline: {
      strokeDasharray: 23,
      animation: `${draw} 500ms ease-in`,
      animationFillMode: 'forwards',
    },
  },
});
const Setup = () => {
  const { data, status } = useSession();
  const setupService = useInterpret(setupMachine);
  const hasFinishedToken = useSelector(setupService, (state) => state.context.hasFinishedToken);
  const isFinished = useSelector(setupService, (state) => state.matches('finished'));
  const currentValue = useSelector(setupService, (state) => state.value.toString());
  const router = useRouter();

  useEffect(() => {
    if (status !== 'loading') {
      setupService.send('updateToken', { canvasToken: data?.user?.canvasToken || '' });
    }
  }, [data?.user?.canvasToken, setupService, status]);

  useEffect(() => {
    const subscription = setupService.subscribe((state) => {
      if (state.matches('finished')) {
        setTimeout(() => {
          router.push('/integrations');
        }, 2000);
      }
    });

    return subscription.unsubscribe;
  }, [router, setupService]);
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
              <AccordionTrigger icon={hasFinishedToken && <StyledCheckIcon tw="text-success" />}>
                Enter your Canvas API Token{' '}
              </AccordionTrigger>
              <Token />
            </AccordionItem>

            {/* <AccordionItem value={ids[1]}>
              <AccordionTrigger>Can it be animated?</AccordionTrigger>
              <AccordionContent>
                Yes! You can animate the Accordion with CSS or JavaScript.
              </AccordionContent>
            </AccordionItem> */}
          </Accordion>
        </div>

        {isFinished && <Confetti />}
      </main>
    </MachineContext.Provider>
  );
};

// export const getServerSideProps: GetServerSideProps = () => {};
export default Setup;
