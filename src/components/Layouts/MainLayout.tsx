import React from 'react';
import Sidebar from '../Sidebar/Sidebar';

interface Props {
  children: React.ReactNode;
}

const MainLayout = ({ children }: Props) => {
  return (
    <div tw="flex h-screen bg-mauve2">
      <Sidebar />
      <main tw="flex-1">
        <div tw="py-8">
          <div tw="px-4 sm:px-6 md:px-8">{children}</div>
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
