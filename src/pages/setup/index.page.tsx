import React from 'react';
import { QuestionMarkCircledIcon } from '@radix-ui/react-icons';
import * as Popover from '@radix-ui/react-popover';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/Accordion';
import Token from './_Token';

const ids = ['a-1', 'a-2', 'a-3'];
const setup = () => {
  return (
    <main tw="grid min-h-screen bg-slate-slate2 place-items-center">
      <div tw="flex flex-col  items-center mb-80">
        <h1 tw="mb-10 text-3xl font-bold">Let&apos;s get you set up!</h1>
        <Accordion type="single" defaultValue={ids[0]} collapsible>
          <AccordionItem value={ids[0]} disabled>
            <AccordionTrigger>Enter your Canvas API Token </AccordionTrigger>
            <Token />
          </AccordionItem>

          <AccordionItem value={ids[1]} disabled>
            <AccordionTrigger>Can it be animated?</AccordionTrigger>
            <AccordionContent>
              Yes! You can animate the Accordion with CSS or JavaScript.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </main>
  );
};

export default setup;
