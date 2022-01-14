import { User as UserDetails } from '@prisma/client';
import { AuthChangeEvent, Session, User, UserCredentials } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import Router from 'next/router';
import { supabase } from '../supabase';

type Status = 'loading' | 'authenticated' | 'unauthenticated';

type UserContextType = {
  session: Session | null;
  user: User | null;
  userDetails: UserDetails | null;
  status: Status;
  signIn: typeof supabase.auth.signIn;
  signOut: typeof supabase.auth.signOut;
};
export const UserContext = createContext<UserContextType | undefined>(undefined);

const setServerSession = async (event: AuthChangeEvent, sess: Session | null) => {
  await fetch('/api/s_auth', {
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    credentials: 'same-origin',
    body: JSON.stringify({ event, session: sess }),
  });
};

const getUser = () => supabase.from<UserDetails>('User').select('*').single();

export const UserContextProvider = (props: any) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

  useEffect(() => {
    const _session = supabase.auth.session();

    setSession(_session);
    setUser(_session?.user || null);

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, sess) => {
      await setServerSession(event, sess);

      setSession(sess);
      setUser(sess?.user || null);

      // eslint-disable-next-line no-empty
      if (sess?.user) {
      } else {
        Router.push('/signin');
      }
    });

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user) {
      getUser().then((res) => {
        setUserDetails(res.data);
        setIsUserLoading(false);
      });
    } else {
      setIsUserLoading(false);
    }
  }, [user]);

  const value: UserContextType = useMemo(
    () => ({
      session,
      user,
      userDetails,
      // eslint-disable-next-line no-nested-ternary
      status: isUserLoading ? 'loading' : session ? 'authenticated' : 'unauthenticated',
      signIn: (creds: UserCredentials) => supabase.auth.signIn(creds),
      signOut: () => {
        return supabase.auth.signOut();
      },
    }),
    [isUserLoading, session, user, userDetails]
  );

  return <UserContext.Provider value={value} {...props} />;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error(`useUser must be used within a UserContextProvider.`);
  }

  return context;
};
