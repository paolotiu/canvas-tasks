import puppeteer from 'puppeteer-core';
import { NextApiHandler } from 'next';
import { z } from 'zod';
import { canvasAxios } from '@/lib/axios';
import { getOptions } from '@/server/puppeteer/options';
import { getHtml } from '@/server/puppeteer/template';
import { RESTCanvasPage } from '@/modules/common/types/moduleItem';
import { auth, getServiceSupabase, storage } from '@/lib/supabase';
import { prisma } from '@/server/prisma';

const schema = z.object({
  moduleId: z.string(),
  urls: z.string().or(z.array(z.string())),
});

export const handler: NextApiHandler = async (req, res) => {
  const session = await auth.api.getUserByCookie(req);

  if (!session?.user) {
    res.send('no');
    return;
  }
  const userDetails = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  if (!userDetails) {
    res.send('no');
    return;
  }

  const parseResult = schema.safeParse(req.body);
  if (!parseResult.success) {
    res.send(parseResult.error.message);
    return;
  }

  const { urls, moduleId } = req.body as z.infer<typeof schema>;

  canvasAxios.defaults.headers.common.Authorization = `Bearer ${userDetails.canvasToken}`;

  const options = await getOptions(true);

  const browser = await puppeteer.launch(options);
  const page = await browser.newPage();

  const regex = /courses\/(\d+?)\//;
  const courseId = urls[0].match(regex)?.[1];
  const fileName = `${courseId}/${moduleId}.pdf`;

  if (!courseId) {
    res.send({
      success: false,
      message: 'Invalid course id',
    });

    return;
  }

  if (typeof urls === 'string') {
    const response = await canvasAxios.get<RESTCanvasPage>(urls, {
      baseURL: '',
    });

    const html = getHtml(decodeURI(response.data?.body || ''));
    await page.setContent(getHtml(html), { waitUntil: 'networkidle0' });
  } else {
    const allRes = await Promise.all(
      urls.map(async (url) => {
        const response = await canvasAxios.get<RESTCanvasPage>(url, {
          baseURL: '',
        });
        return response.data;
      })
    );

    const html = getHtml(
      allRes
        .map((p) => {
          const encoded = encodeURI(p.body || ((p as any).message as string));
          const h = decodeURI(encoded);

          const final = `<h2 class="page-break">${p.title}</h2>` + h;

          return final;
        })
        .join('')
    );

    await page.setContent(getHtml(html), { waitUntil: 'networkidle0', timeout: 0 });
  }

  const file = await page.pdf({
    timeout: 0,
  });
  await browser.close();

  const response = await getServiceSupabase().storage.from('modules').upload(fileName, file, {
    cacheControl: '3600',
    contentType: 'application/pdf',
    upsert: true,
  });

  if (response.data?.Key) {
    const { publicURL } = storage.from('modules').getPublicUrl(fileName);
    // res.setHeader('Content-Type', `application/pdf`);
    res.send({
      url: publicURL,
    });
  }
};
export default handler;
