import { QuestionMarkCircledIcon, Cross2Icon } from '@radix-ui/react-icons';
import React, { useState } from 'react';
import { useDebounce } from 'use-debounce';
import * as Popper from '@/components/PopperDialog';
import { AccordionContent } from '@/components/Accordion';
import { trpc } from '@/lib/utils/trpc';

const HowToGetToken = () => {
  return (
    <div>
      <Popper.Root tw="rounded-sm inline">
        <Popper.Trigger>
          <p tw="text-xs flex items-center hover:underline cursor-pointer">
            <QuestionMarkCircledIcon tw="mr-1" />
            How to get the the token?
          </p>
        </Popper.Trigger>
        <Popper.Content
          tw="bg-white p-4 shadow-xl rounded-sm max-w-popper text-xs text-slate12"
          side="bottom"
        >
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla eos aliquam vel voluptas
          modi. Autem non consequuntur exercitationem quas aliquam quisquam quos aut? Ipsam optio
          cum tenetur pariatur ducimus. Blanditiis?
          <Popper.Arrow tw="text-white fill-current" />
        </Popper.Content>
      </Popper.Root>
    </div>
  );
};

const StatusText = ({ icon, label }: { label: string; icon?: React.ReactNode }) => {
  return (
    <p tw="text-xs flex items-center gap-1 ">
      {icon || null}
      <span>{label}</span>
    </p>
  );
};
const statusMap = {
  error: () => <StatusText label="Invalid Token" icon={<Cross2Icon />} />,
  idle: () => null,
  loading: () => <StatusText label="Loading..." />,
  success: () => <StatusText label="Success!" />,
};
const _Token = () => {
  const [token, setToken] = useState('');
  const [debouncedToken] = useDebounce(token, 500);
  const { status } = trpc.useQuery(['verifyToken', debouncedToken], {
    enabled: !!token,
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const Status = statusMap[status];

  return (
    <AccordionContent>
      <div tw="grid gap-2">
        <div tw="text-slate12">
          <h3 tw="font-medium text-lg pb-1">Enter Canvas Token</h3>
          <div tw="flex">
            <input
              type="text"
              tw="px-2 py-1 max-w-[250px] border"
              disabled={status === 'success'}
              onChange={(e) => {
                if (status === 'success') return;
                setToken(e.currentTarget.value);
              }}
            />
          </div>
          <Status />
        </div>

        <HowToGetToken />
      </div>
    </AccordionContent>
  );
};

export default _Token;
