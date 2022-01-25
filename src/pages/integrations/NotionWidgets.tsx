import * as Accordion from '@radix-ui/react-accordion';
import { ClipboardCopyIcon } from '@radix-ui/react-icons';
import Image from 'next/image';
import tw, { styled } from 'twin.macro';
import { keyframes } from '@stitches/react';
import toast from 'react-hot-toast';
import { useUser } from '@/lib/auth/useUser';
import { APP_URL } from '@/lib/config';

const slideDown = keyframes({
  from: { height: 0 },
  to: { height: 'var(--radix-accordion-content-height)' },
});

const slideUp = keyframes({
  from: { height: 'var(--radix-accordion-content-height)' },
  to: { height: 0 },
});

const AccordionItem = styled(Accordion.Item, {
  '.header': {
    ...tw`pb-0 transition-all duration-300`,
    transitionTimingFunction: 'cubic-bezier(0.87, 0, 0.13, 1)',
  },

  '&[data-state="open"]': {
    '.header': {
      ...tw`pb-3`,
    },
  },
});

const AccordionContent = styled(Accordion.Content, {
  overflow: 'hidden',
  '&[data-state="open"]': {
    animation: `${slideDown} 300ms cubic-bezier(0.87, 0, 0.13, 1)`,
  },
  '&[data-state="closed"]': {
    animation: `${slideUp} 300ms cubic-bezier(0.87, 0, 0.13, 1)`,
  },
});

const NotionWidgets = () => {
  const { user } = useUser();

  const userAnnouncementsWidget = `${APP_URL}/notion/${user?.id}/announcements`;

  return (
    <Accordion.Root type="multiple" tw="bg-white p-4 w-full shadow rounded-sm">
      <AccordionItem value="a">
        <div tw="flex justify-between items-center" className="header">
          <div tw="flex items-center space-x-3">
            <Image src="/logos/notion.svg" alt="notion logo" width={35} height={35} quality={100} />
            <div tw="flex-grow">
              <p tw="font-medium text-mauve12">Notion Widgets</p>
              <p tw="text-sm text-mauve11">Embed widgets</p>
            </div>
          </div>
          <Accordion.Trigger tw="rounded-sm px-3 py-2 border font-medium text-mauve12  text-sm hover:bg-mauve2">
            View Widgets
          </Accordion.Trigger>
        </div>
        <AccordionContent>
          <div tw="bg-white border-t pt-4 pb-3">
            <div>
              <h3 tw="font-medium text-sm pb-1">Announcements</h3>
              <div tw="flex">
                <input
                  type="text"
                  tw="border border-r-0 text-sm py-1 px-2 w-full max-w-[40ch] rounded-l-sm bg-mauve2"
                  readOnly
                  value={userAnnouncementsWidget}
                />
                <button
                  tw="bg-mauve3 border border-l-0 px-3 rounded-r-sm hover:bg-mauve4"
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(userAnnouncementsWidget);
                    toast.success('Link copied');
                  }}
                >
                  <ClipboardCopyIcon />
                </button>
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion.Root>
  );
};

export default NotionWidgets;
