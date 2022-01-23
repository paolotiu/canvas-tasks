import { createClient, GoTrueClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_KEY as string
);

export const getServiceSupabase = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.SUPABASE_SERVICE_KEY as string
  );

export const goTrue = new GoTrueClient({
  url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1`,
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
    apikey: `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
  },
  cookieOptions: {
    name: 'sb:token',
    lifetime: 604800,
    domain: '',
    path: '/',
    sameSite: 'lax',
  },
});

export const { auth, storage } = supabase;
