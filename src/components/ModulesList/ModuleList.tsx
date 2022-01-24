import React from 'react';
import {
  IconFileText,
  IconMessages,
  IconPaperclip,
  IconPencil,
  IconRocket,
  TablerIcon,
} from '@tabler/icons';

import { DownloadIcon, ExternalLinkIcon } from '@radix-ui/react-icons';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/Accordion/ModulesAccordion';
import { ModuleItemType, RESTCourseModule } from '@/modules/common/types';
import Link from '../Link/Link';
import { APP_URL } from '@/lib/config';

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

  return (
    <Accordion type="single" collapsible defaultValue={name}>
      <AccordionItem value={name} tw="border">
        <AccordionTrigger
          title={name}
          PopoverStuff={
            <div tw="text-sm">
              <button
                type="button"
                tw=" hover:bg-mauve3 rounded-sm transition-colors py-2 px-4 flex items-center"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(`${APP_URL}/document/${courseId}/${moduleNode.id}`, '_blank');
                }}
              >
                <DownloadIcon tw="mr-2" />
                Print module
              </button>
            </div>
          }
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
                  tw="bg-white px-5 py-3 border-b last:border-none text-gray-700 transition duration-100 hover:text-mauve12 min-w-0 block"
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

            if (item.type === 'Quiz') {
              return (
                <a
                  href={item.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  tw="bg-white px-5 py-3 border-b last:border-none cursor-pointer hover:bg-mauve2 text-gray-700 transition duration-100 hover:text-mauve12 min-w-0 block"
                  key={item.id}
                >
                  <p
                    tw="flex items-center gap-2 font-medium"
                    style={{
                      paddingLeft: `${item.indent * 18}px`,
                    }}
                  >
                    {Icon ? <Icon width={18} height={18} strokeWidth={1} /> : null}
                    <span tw="relative flex items-center">
                      {item.title}
                      <ExternalLinkIcon tw="mt-[3px] ml-1" />
                    </span>
                  </p>
                </a>
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
