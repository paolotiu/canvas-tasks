import React from 'react';
import {
  IconFileText,
  IconMessages,
  IconPaperclip,
  IconPencil,
  IconRocket,
  TablerIcon,
} from '@tabler/icons';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/Accordion/ModulesAccordion';
import { ModuleItemType, RESTCourseModule } from '@/modules/common/types';

interface Props {
  moduleNode: RESTCourseModule;
}

const ModuleItemIcons: Record<ModuleItemType, TablerIcon | null> = {
  Assignment: IconPencil,
  File: IconPaperclip,
  Discussion: IconMessages,
  Page: IconFileText,
  Quiz: IconRocket,
  ExternalTool: null,
};

const ModulesList = ({ moduleNode }: Props) => {
  const name = moduleNode.name || '';
  return (
    <Accordion type="single" collapsible defaultValue={name}>
      <AccordionItem value={name} tw="border">
        <AccordionTrigger title={name} onOptionsClick={() => console.log('askdja')} />
        <AccordionContent>
          {moduleNode.items?.map((item) => {
            const Icon = ModuleItemIcons[item.type];
            return (
              <div
                //   eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
                tabIndex={0}
                tw="bg-white px-5 py-3 border-b last-of-type:border-none cursor-pointer hover:bg-mauve2 text-gray-700 transition duration-100 hover:text-mauve12 min-w-0"
                key={item.id}
              >
                <p
                  tw="flex items-center gap-2"
                  style={{
                    paddingLeft: `${item.indent * 18}px`,
                  }}
                >
                  {Icon ? <Icon width={18} height={18} strokeWidth={1} /> : null}
                  {item.title}
                </p>
              </div>
            );
          })}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default ModulesList;
