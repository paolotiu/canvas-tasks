import { GetServerSideProps } from 'next';
import Head from 'next/head';
import React, { useEffect } from 'react';
import tw, { styled } from 'twin.macro';
import { createContext } from '@/server/context';
import { RESTCanvasPage } from '@/modules/common/types/moduleItem';
import { RESTCourseModule } from '@/modules/common/types';

type Props = any;

const Container = styled('div', {
  article: tw`prose max-w-none`,
  section: tw`mx-auto`,
  p: {
    pageBreakInside: 'avoid',
  },
  table: {
    ...tw`!w-full`,
    'td, th': {
      ...tw`!w-full`,
    },
  },
});

const ModulePrintable = (props: Props) => {
  useEffect(() => {
    document.body.classList.add('A4');
    window.print();
  }, []);

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/paper-css/0.3.0/paper.css"
        />
        <style>{'@page { size: A4 }'}</style>
        <style>
          {`
          .sheet {
  overflowY: visible;
  min-height: 296mm;
  height: auto !important;
}
          `}
        </style>
      </Head>
      <Container
        dangerouslySetInnerHTML={{
          __html: props.html,
        }}
      ></Container>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { id, courseId } = ctx.params as { id: string; courseId: string };
  const { canvasAxios } = await createContext({
    ...ctx,
  });

  const res = await canvasAxios.get<RESTCourseModule>(`/courses/${courseId}/modules/${id}`, {
    params: {
      include: ['items', 'content_details'],
    },
  });

  const urls = res.data.items.reduce(
    (acc, curr) => (curr.url && curr.type !== 'Assignment' ? [...acc, curr.url] : acc),
    [] as string[]
  );

  const allRes = await Promise.all(
    urls.map(async (url) => {
      const response = await canvasAxios.get<RESTCanvasPage>(url, {
        baseURL: '',
      });
      return response.data;
    })
  );

  const html = allRes
    ?.map((p) => {
      const encoded = encodeURI(p.body || ((p as any).message as string));
      const h = decodeURI(encoded);

      const final = `<section class="sheet padding-10mm">
      <article>
      <h2>${p.title}</h2>
      ${h}
      </article>
      </section>`;

      return final;
    })
    .join('');

  return {
    props: {
      html,
    },
  };
};

export default ModulePrintable;
