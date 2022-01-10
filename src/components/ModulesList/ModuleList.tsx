import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/Accordion/ModulesAccordion';
import { RESTCourseModule } from '@/modules/common/types';

// type MConnection = Pick<
//   NonNullable<CourseModulesQuery['course']>,
//   'modulesConnection'
// >['modulesConnection'];
// type MNode = Pick<NonNullable<MConnection>, 'nodes'>['nodes'];

interface Props {
  moduleNode: RESTCourseModule;
}

const ModulesList = ({ moduleNode }: Props) => {
  const name = moduleNode.name || '';
  return (
    <Accordion type="single" collapsible defaultValue={name}>
      <AccordionItem value={name} tw="border">
        <AccordionTrigger title={name} onOptionsClick={() => console.log('askdja')} />
        <AccordionContent>
          {moduleNode.items?.map((item) => {
            return (
              <div
                //   eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
                tabIndex={0}
                tw="bg-white px-5 py-3 border-b last-of-type:border-none cursor-pointer hover:bg-mauve2 text-gray-700 transition duration-100 hover:text-mauve12 min-w-0"
                key={item.id}
              >
                <p
                  style={{
                    paddingLeft: `${item.indent * 12}px`,
                  }}
                >
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
