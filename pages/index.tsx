import { signIn, useSession } from 'next-auth/react';
import Hello from '@/components/Hello';
import MainLayout from '@/layouts/MainLayout';
import { trpc } from '@/lib/utils/trpc';

export default function Home() {
  const { data, status } = useSession();

  const x = trpc.useQuery(['tasks']);

  return (
    <MainLayout>
      <div className="text-3xl">
        <div className="pt-5">
          <Hello />
        </div>
        {status === 'authenticated' ? (
          <>
            <p>{data?.user?.name}</p>
            <p>{JSON.stringify(data)}</p>
          </>
        ) : (
          <button
            type="button"
            onClick={() => {
              signIn('google', { callbackUrl: 'http://localhost:3000' });
            }}
          >
            Sign In
          </button>
        )}
      </div>
      <p>{JSON.stringify(x.data)}</p>
    </MainLayout>
  );
}
