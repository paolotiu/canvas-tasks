import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { GetServerSidePropsContext } from 'next';
import { User } from '@supabase/supabase-js';
import { useUser } from '@/lib/auth/useUser';
import { auth } from '@/lib/supabase';

interface Props {
  children: JSX.Element;
  needsCanvasToken?: boolean;
}

const Protected = ({ children, needsCanvasToken = true }: Props) => {
  const { status, userDetails } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin');
    }
    if (status === 'authenticated' && !userDetails?.canvasToken && needsCanvasToken) {
      router.push('/setup');
    }
  }, [needsCanvasToken, router, status, userDetails]);

  if (needsCanvasToken) {
    if (status === 'authenticated' && !!userDetails?.canvasToken) {
      return children;
    }
  } else if (status === 'authenticated') {
    return children;
  }

  return null;
};

export type ProtectedRouteProps = {
  props: {
    user: User;
    loggedIn: boolean;
    [key: string]: any;
  };
};

export type ProtectedRouteRedirProps = {
  redirect: {
    destination: string;
    permanent: boolean;
  };
};

export type ProtectedRouteServerSideProps = ProtectedRouteProps | ProtectedRouteRedirProps;

export type GetPropsFuncProps = {
  user?: User;
};

export type GetPropsFunc = (option: GetPropsFuncProps) => void;

export type ProtectedRouteOption = {
  context: GetServerSidePropsContext;
  redirectTo?: string;
  getPropsFunc?: GetPropsFunc;
};

export const SSRProtected = async ({
  context: { req },
  redirectTo = '/',
  getPropsFunc = () => {},
}: ProtectedRouteOption): Promise<ProtectedRouteServerSideProps> => {
  const { user } = await auth.api.getUserByCookie(req);
  // We can do a re-direction from the server
  if (!user) {
    return {
      redirect: {
        destination: redirectTo ?? '/',
        permanent: false,
      },
    };
  }

  const resolvedProps = getPropsFunc ? await getPropsFunc({ user }) : {};
  // or, alternatively, can send the same values that client-side context populates to check on the client and redirect
  return {
    props: {
      ...resolvedProps,
      user,
      loggedIn: !!user,
    },
  };
};

export default Protected;
