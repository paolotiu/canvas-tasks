import { NextApiRequest, NextApiResponse } from 'next';
import { goTrue } from '@/lib/supabase';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  goTrue.api.setAuthCookie(req, res);
  // supabase.auth.api.setAuthCookie(req, res);
}
