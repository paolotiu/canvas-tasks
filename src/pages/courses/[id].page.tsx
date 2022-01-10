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
    { staleTime: Infinity }
  );

  return (
    <MainLayout>
      <div tw="grid gap-7 justify-items-center" style={{ gridTemplateColumns: '1fr' }}>
        {data?.map((mod) => {
          if (!mod) return null;
          return <ModuleList moduleNode={mod} key={mod.name} />;
        })}
      </div>
    </MainLayout>
  );
};

export default CoursePage;
