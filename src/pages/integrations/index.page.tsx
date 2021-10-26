import React from 'react';
import Image from 'next/image';
import { useMutation } from 'react-query';
import MainLayout from '@/components/Layouts/MainLayout';
import { trpc } from '@/lib/utils/trpc';
import ConnectedGoogleTask from './ConnectedGoogleTask';

const Integrations = () => {
  const mutation = useMutation(async () => {
    const path = '/api/integrations/googletasks/add';
    const res = await fetch(path);
    if (!res.ok) {
      throw new Error('Something went wrong');
    }
    const json = await res.json();
    window.location.href = json.url;
  });

  const { data } = trpc.useQuery(['integrations']);

  return (
    <MainLayout>
      {data?.map((item) => {
        if (item.type === 'google_tasks' && item.selectedTaskTypes) {
          return <ConnectedGoogleTask item={item as any} key={item.id} />;
        }
        return null;
      })}
      <div tw="bg-white p-4 w-full shadow rounded-sm flex justify-between items-center">
        <div tw="flex items-center space-x-3">
          <Image
            src="/logos/google-tasks.svg"
            alt="google tasks logo"
            width={35}
            height={35}
            quality={100}
          />
          <div tw="flex-grow">
            <p tw="font-medium text-mauve12">Google Tasks</p>
            <p tw="text-sm text-mauve11">For automatic syncing of tasks</p>
          </div>
        </div>
        <button
          tw="rounded-sm px-3 py-2 border font-medium text-mauve12  text-sm hover:bg-mauve2"
          type="button"
          onClick={() => mutation.mutate()}
        >
          Connect
        </button>
      </div>
    </MainLayout>
  );
};

export default Integrations;
