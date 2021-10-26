import React from 'react';
import { styled } from '@stitches/react';
import { IconApps } from '@tabler/icons';
import tw from 'twin.macro';
import Link from '@/components/Link/Link';

// interface Props {}

const SidebarNavItem = styled(Link, {
  ...tw`flex items-center p-2 text-sm rounded-sm hover:bg-mauve2 `,
  '& svg': tw`w-5 h-5 mr-3 stroke-1`,
});

const Sidebar = () => {
  return (
    <aside tw="h-screen w-56 border-r px-2 hidden md:flex bg-white">
      <nav tw="mt-5">
        <SidebarNavItem href="/integrations">
          <IconApps />
          Integrations
        </SidebarNavItem>
      </nav>
    </aside>
  );
};

export default Sidebar;
