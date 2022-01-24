import Image from 'next/image';
import { useUser } from '@/lib/auth/useUser';
import { APP_URL } from '@/lib/config';

const Login = () => {
  const { signIn } = useUser();
  return (
    <main tw="min-h-screen bg-mauve2">
      <div tw="pt-20 flex flex-col items-center">
        <div tw="mx-auto bg-white px-6 py-7 rounded shadow mt-10 flex flex-col items-center w-[320px] max-w-[90vw]">
          <div tw="flex items-center flex-col space-y-4">
            <Image src="/logos/icantvas.svg" width={40} height={40} alt="ICantvas Logo" />
            <h1 tw="text-2xl font-bold">Sign in to ICantvas</h1>
          </div>
          <button
            type="button"
            tw="border px-6 py-3 rounded-sm hover:bg-mauve2 flex items-center justify-center space-x-3 mt-8 w-full"
            onClick={async () => {
              await signIn(
                {
                  provider: 'google',
                },
                {
                  redirectTo: `${APP_URL}/provider`,
                }
              );

              // await signOut({
              //   redirect: false,
              // });
              // await signIn('google', { callbackUrl: process.env.NEXT_PUBLIC_APP_URL + '/setup' });
            }}
          >
            <Image src="/logos/google.svg" width={15} height={15} alt="ICantvas Logo" />
            <span>Sign in with Google</span>
          </button>
        </div>
      </div>
    </main>
  );
};

export default Login;
