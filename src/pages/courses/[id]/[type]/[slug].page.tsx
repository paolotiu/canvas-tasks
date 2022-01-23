import { useRouter } from 'next/router';
import React, { useRef } from 'react';
import tw, { styled } from 'twin.macro';
import { DotsVerticalIcon } from '@radix-ui/react-icons';
import { trpc } from '@/lib/utils/trpc';
import { RESTModuleItemType } from '@/modules/common/types/moduleItem';
import MainLayout from '@/components/Layouts/MainLayout';

const Article = styled('article', {
  ...tw`px-8 py-10 prose text-black bg-white border max-w-none`,
  fontFamily: '"Inter", sans-serif',
  h3: tw`font-normal`,
  h1: tw`text-lg font-bold`,
  iframe: tw`mx-auto`,
  '.instructure_file_link ': tw`block text-center`,
});
const ArticleContainer = styled('div', {
  ...tw`flex flex-col items-center`,
  'article,.bar': {
    maxWidth: 'clamp(100px, 800px, 90%)',
    ...tw`shadow-sm`,
  },
});

const regex = /style="(.*?)"/gm;

const ItemPage = () => {
  const router = useRouter();

  const { id, type, slug } = router.query as { id: string; type: RESTModuleItemType; slug: string };

  const { data } = trpc.useQuery(['moduleItem', { courseId: id, slug, type }], {
    staleTime: Infinity,
  });
  const articleRef = useRef<HTMLElement | null>(null);

  let html = '';
  let title = '';

  if (!data) {
    return null;
  }

  if (data.type === 'pages') {
    html = data.body;
    title = data.title;
  } else if (data.type === 'discussion_topics') {
    html = data.message;

    title = data.title;
  } else if (data.type === 'assignments') {
    html = data.description;
    title = data.name;
  }

  return (
    <MainLayout>
      <ArticleContainer tw="flex flex-col items-center">
        <div className="bar" tw="bg-mauve4 rounded-t-sm px-4 py-2 w-full border border-b-0">
          <button type="button" tw="ml-auto block p-2 hover:bg-mauve5 rounded-sm ">
            <DotsVerticalIcon />
          </button>
        </div>
        <Article
          ref={articleRef}
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            // Remove all style tags
            __html: `<h1> ${title} </h1> ${html.replace(regex, '')}`,
          }}
        ></Article>
        <hr tw="my-10" />
      </ArticleContainer>
    </MainLayout>
  );
};

export default ItemPage;
