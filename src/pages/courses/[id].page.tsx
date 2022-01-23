import React from 'react';
import { useRouter } from 'next/router';

import MainLayout from '@/components/Layouts/MainLayout';
import { trpc } from '@/lib/utils/trpc';

import ModuleList from '@/components/ModulesList';

const CoursePage = () => {
  const router = useRouter();
  const { id } = router.query as { id: string };

  const { data } = trpc.useQuery(
    [
      'modules',
      {
        id,
      },
    ],
    {
      staleTime: Infinity,
    }
  );

  return (
    <MainLayout>
      <div tw="grid gap-10 justify-items-center">
        {data?.map((mod) => {
          return <ModuleList key={mod.id} courseId={id} moduleNode={mod} />;
        })}
      </div>
    </MainLayout>
  );
};

export default CoursePage;
CoursePage.auth = true;
