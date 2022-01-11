import { useSession } from 'next-auth/react';

interface Props {
  children: JSX.Element;
}

const Protected = ({ children }: Props) => {
  const { status } = useSession({ required: true });

  if (status === 'authenticated') {
    return children;
  }

  return null;
};

export default Protected;
