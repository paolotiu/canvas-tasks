import React from 'react';
import Head from 'next/head';

interface Props {
  children: React.ReactNode;
}

const MainLayout = ({ children }: Props) => {
  return (
    <>
      <Head>
        <title>Cool App!</title>
      </Head>
      <div>{children}</div>
    </>
  );
};

export default MainLayout;
