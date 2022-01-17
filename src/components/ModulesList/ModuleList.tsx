import React from 'react';
import {
  IconFileText,
  IconMessages,
  IconPaperclip,
  IconPencil,
  IconRocket,
  TablerIcon,
} from '@tabler/icons';
import axios from 'axios';
import { useMutation } from 'react-query';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/Accordion/ModulesAccordion';
import { ModuleItemType, RESTCourseModule } from '@/modules/common/types';
import Link from '../Link/Link';
// import axios, { AxiosResponse } from 'axios';
// import { useMutation } from 'react-query';

interface Props {
  moduleNode: RESTCourseModule;
  courseId: string;
}

const ModuleItemIcons: Record<ModuleItemType, TablerIcon | null> = {
  Assignment: IconPencil,
  File: IconPaperclip,
  Discussion: IconMessages,
  Page: IconFileText,
  Quiz: IconRocket,
  ExternalTool: null,
  SubHeader: null,
};

const ModulesList = ({ moduleNode, courseId }: Props) => {
  const name = moduleNode.name || '';

  const pdf = useMutation(({ urls, moduleId }: { urls: string[]; moduleId: string }) => {
    return axios.post('/api/pdf/modulePages', { urls, moduleId });
    // let i;
    // let j;
    // const CHUNK_SIZE = 8;

    // const results: Array<Promise<AxiosResponse>> = [];
    // for (i = 0, j = opts.urls.length; i < j; i += CHUNK_SIZE) {
    //   const temp = opts.urls.slice(i, i + CHUNK_SIZE);
    //   results.push(
    //     axios.post('/api/pdf/modulePages', { urls: temp }, { responseType: 'arraybuffer' })
    //   );
    // }
    // const final = await Promise.all(results);
    // return final.map((res) => res.data);
  });

  return (
    <Accordion type="single" collapsible defaultValue={name}>
      <AccordionItem value={name} tw="border">
        <AccordionTrigger
          title={name}
          onOptionsClick={async () => {
            const urls = moduleNode.items.reduce(
              (acc, curr) => (curr.url ? [...acc, curr.url] : acc),
              [] as string[]
            );
            await pdf.mutateAsync({
              urls,
              moduleId: String(moduleNode.id),
            });
          }}
        />
        <AccordionContent>
          {moduleNode.items?.map((item) => {
            const Icon = ModuleItemIcons[item.type];

            const regex = /\/api\/v1\/courses\/(?:\d+)\/(\w+)\/([\w|\-|%]+)/;

            const match = regex.exec(item.url);

            const type = match?.[1];
            const id = match?.[2];
            if (item.type === 'SubHeader' || !type || !id) {
              return (
                <div
                  tw="bg-white px-5 py-3 border-b last-of-type:border-none cursor-pointer hover:bg-mauve2 text-gray-700 transition duration-100 hover:text-mauve12 min-w-0 block"
                  key={item.id}
                >
                  <p
                    tw="flex items-center gap-2 font-medium"
                    style={{
                      paddingLeft: `${item.indent * 18}px`,
                    }}
                  >
                    {Icon ? <Icon width={18} height={18} strokeWidth={1} /> : null}
                    {item.title}
                  </p>
                </div>
              );
            }
            return (
              <Link
                href={`/courses/${courseId}/${type}/${id}`}
                //   eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
                tabIndex={0}
                tw="bg-white px-5 py-3 border-b last-of-type:border-none cursor-pointer hover:bg-mauve2 text-gray-700 transition duration-100 hover:text-mauve12 min-w-0 block"
                key={item.id}
              >
                <p
                  tw="flex items-center gap-2 font-medium"
                  style={{
                    paddingLeft: `${item.indent * 18}px`,
                  }}
                >
                  {Icon ? <Icon width={18} height={18} strokeWidth={1} /> : null}
                  {item.title}
                </p>
              </Link>
            );
          })}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default ModulesList;
