import { QuestionMarkCircledIcon } from '@radix-ui/react-icons';
import * as Popover from '@radix-ui/react-popover';
import React from 'react';
import { AccordionContent } from '@/components/Accordion';

const _Token = () => {
  return (
    <AccordionContent>
      <Popover.Root open>
        <Popover.Trigger>
          <p tw="text-sm flex items-center hover:underline cursor-pointer">
            <QuestionMarkCircledIcon tw="mr-1" />
            How to get the token?
          </p>
        </Popover.Trigger>
        <Popover.Content tw="bg-white p-4 shadow-xl rounded-sm" side="top">
          <Popover.Close />
          <Popover.Arrow tw="text-white fill-current" />
        </Popover.Content>
      </Popover.Root>

      <input type="text" />
    </AccordionContent>
  );
};

export default _Token;
