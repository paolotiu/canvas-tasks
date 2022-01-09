import React from 'react';
import { ComponentProps } from '@stitches/react';
import { IconApps } from '@tabler/icons';
import tw, { styled } from 'twin.macro';
import { useRouter } from 'next/router';
import { ExitIcon, ReaderIcon } from '@radix-ui/react-icons';
import { signOut } from 'next-auth/react';
import Link from '@/components/Link/Link';

const StyledSidebarNavItem = styled(Link, {
  variants: {
    active: {
      true: tw`bg-mauve3 hover:bg-mauve3`,
    },
  },
  ...tw`flex items-center p-2 text-sm transition-colors rounded-sm hover:bg-mauve2`,
  '& svg': tw`mr-3 stroke-1 `,
});

const SidebarNavItem = (props: ComponentProps<typeof StyledSidebarNavItem>) => {
  const router = useRouter();

  return <StyledSidebarNavItem active={router.pathname === props.href} {...props} />;
};

const Sidebar = () => {
  return (
    <aside tw="h-screen sticky top-0 w-56 border-r px-2 hidden md:flex flex-col justify-between bg-white py-5">
      <nav tw="grid gap-2">
        <SidebarNavItem href="/integrations">
          <IconApps width={15} height={15} />
          Integrations
        </SidebarNavItem>

        <SidebarNavItem href="/courses">
          <ReaderIcon />
          Courses
        </SidebarNavItem>
      </nav>

      <button
        type="button"
        tw="flex items-center text-sm p-2 hover:bg-red4 rounded-sm"
        onClick={() => {
          signOut({
            callbackUrl: process.env.NEXT_PUBLIC_APP_URL,
          });
        }}
      >
        <ExitIcon tw="mr-2" />
        Log out
      </button>
    </aside>
  );
};

export default Sidebar;
