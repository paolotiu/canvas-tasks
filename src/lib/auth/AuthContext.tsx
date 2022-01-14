import { AuthChangeEvent, Provider, Session, UserCredentials, User } from '@supabase/supabase-js';
import Router from 'next/router';
import { createContext, FunctionComponent, useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { ROUTE_HOME, ROUTE_AUTH } from './config';

type Status = 'loading' | 'authenticated' | 'unauthenticated';
export type AuthContextProps = {
  user: User | null;
  signUp: (payload: UserCredentials) => void;
  signIn: (payload: UserCredentials) => void;
  signInWithProvider: (provider: Provider) => Promise<void>;
  signOut: () => void;
  status: Status;
  loggedIn: boolean;
  loading: boolean;
  userLoading: boolean;
};
