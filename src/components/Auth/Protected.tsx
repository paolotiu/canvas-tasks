import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useUser } from '@/lib/auth/useUser';

interface Props {
  children: JSX.Element;
}

const Protected = ({ children }: Props) => {
  const { status } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin');
    }
  }, [router, status]);

  if (status === 'authenticated') {
    return children;
  }

  return null;
};

export default Protected;
