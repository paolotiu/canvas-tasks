import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { createSSGHelpers } from '@trpc/react/ssg';
import React from 'react';
import { parse } from 'node-html-parser';
import { format } from 'date-fns';
import * as Avatar from '@radix-ui/react-avatar';
import tw, { styled } from 'twin.macro';
import { globalCss } from '@stitches/react';
import { createContext, getUserDetails } from '@/server/context';
import { inferQueryOutput } from '@/lib/utils/trpc';
import { appRouter } from '@/server/index';

const Container = styled('div', {
  ...tw`grid h-full overflow-auto`,
  span: {
    ...tw`text-mauve11`,
  },

  a: tw`hover:bg-mauve2 `,
  '@media (prefers-color-scheme: dark)': {
    span: tw`text-notion-text-dark`,

    a: tw` hover:bg-notion-darkHover`,
  },
});

const globalStyles = globalCss({
  '::-webkit-scrollbar': tw`w-[10px] bg-transparent `,
  '::-webkit-scrollbar-thumb': tw`bg-[#D3D1CB] hover:bg-[#aeaca6]`,
  '::-webkit-scrollbar-track': tw`bg-[#EDECE9]`,
  body: {
    '@media (prefers-color-scheme: dark)': {
      ...tw`bg-notion-dark text-notion-text-dark`,
    },
  },
});

const Notion = ({ items }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  globalStyles();

  return (
    <Container>
      {items?.map((item) => {
        return (
          <React.Fragment key={item.id}>
            <a
              tw="block  transition-colors overflow-hidden py-3 px-2"
              href={item.html_url}
              target="__blank"
              rel="noopener noreferrer"
            >
              <div tw="flex items-baseline text-xs">
                <p>{item.courseCode}</p>
                <span tw="ml-6">{format(new Date(item.posted_at || item.created_at), 'PP')}</span>
              </div>

              <h2 tw="font-medium">{item.title}</h2>
              <div tw="line-clamp-1 text-sm">{item.text}</div>
              <div tw="flex items-center pt-2">
                <Avatar.Root tw="w-[15px] h-[15px] rounded-full inline-flex items-center justify-center align-middle overflow-hidden border">
                  <Avatar.Image src={item.author.avatar_image_url} tw="w-full h-full" />
                  <Avatar.Fallback tw="w-full h-full  flex items-center justify-center text-sm">
                    {item.author.display_name?.split(' ')[0][0]}
                  </Avatar.Fallback>
                </Avatar.Root>
                <span tw="text-xs ml-2">{item.author.display_name}</span>
              </div>
            </a>
            <div tw="border-t"></div>
          </React.Fragment>
        );
      })}
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps<{
  // Idk this prevents nextjs to build
  // @ts-ignore
  items: Array<inferQueryOutput<'allAnnouncements'>['0'] & { text: string }>;
  trpcState: any;
}> = async (ctx) => {
  const { params } = ctx;
  const { userId } = params as { userId: string };

  const user = await getUserDetails({
    userId,
  });

  if (!user) {
    return {
      props: {},
      notFound: true,
    };
  }
  const ssr = createSSGHelpers({
    router: appRouter,
    ctx: await createContext({ ...ctx, user }),
  });

  const data = await ssr.fetchQuery('allAnnouncements');

  return {
    props: {
      trpcState: ssr.dehydrate(),
      items: data.map((item) => {
        const root = parse(item.message);

        return {
          ...item,
          text: root.textContent,
        };
      }),
    },
  };
};

export default Notion;
