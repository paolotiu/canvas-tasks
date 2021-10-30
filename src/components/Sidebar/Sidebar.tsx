import React from 'react';
import { ComponentProps, styled } from '@stitches/react';
import { IconApps } from '@tabler/icons';
import tw from 'twin.macro';
import { useRouter } from 'next/router';
import Link from '@/components/Link/Link';

const StyledSidebarNavItem = styled(Link, {
  variants: {
    active: {
      true: tw`bg-mauve3`,
    },
  },
  ...tw`flex items-center p-2 text-sm rounded-sm hover:bg-mauve3`,
  '& svg': tw`w-5 h-5 mr-3 stroke-1`,
});

const SidebarNavItem = (props: ComponentProps<typeof StyledSidebarNavItem>) => {
  const router = useRouter();

  return <StyledSidebarNavItem active={router.asPath === props.href} {...props} />;
};

const Sidebar = () => {
  return (
    <aside tw="h-screen w-56 border-r px-2 hidden md:flex flex-col bg-white">
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
