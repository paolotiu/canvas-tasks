import * as AccordionPrimitive from '@radix-ui/react-accordion';
import tw, { styled } from 'twin.macro';
import React from 'react';
import { keyframes } from '@stitches/react';
import { blackA, mauve } from '@radix-ui/colors';
import { ChevronDownIcon, DotsVerticalIcon } from '@radix-ui/react-icons';
import { Popover, PopoverContent, PopoverTrigger } from '../Popover';

const slideDown = keyframes({
  from: { height: 0 },
  to: { height: 'var(--radix-accordion-content-height)' },
});

const slideUp = keyframes({
  from: { height: 'var(--radix-accordion-content-height)' },
  to: { height: 0 },
});

const StyledAccordion = styled(AccordionPrimitive.Root, {
  ...tw`rounded-sm`,
  boxShadow: `0 2px 10px ${blackA.blackA4}`,

  width: '100%',
  '@md': {
    width: `clamp(300px, 90%, 900px)`,
  },
});

const StyledItem = styled(AccordionPrimitive.Item, {
  overflow: 'hidden',
  marginTop: 1,

  '&:first-child': {
    marginTop: 0,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },

  '&:last-child': {
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  // '&:focus-within': tw`ring-2 ring-mauve-mauve12 z-[1] relative`,
});

const StyledHeader = styled(AccordionPrimitive.Header, {
  all: 'unset',
  display: 'flex',
});

const StyledTrigger = styled(AccordionPrimitive.Trigger, {
  fontFamily: 'inherit',
  padding: '0 20px',
  height: 45,
  width: 0,
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  fontSize: 15,
  boxShadow: `0 1px 0 ${mauve.mauve6}`,
  cursor: 'pointer',
  '&[data-state="closed"]': { backgroundColor: mauve.mauve3 },
  '&[data-state="open"]': { backgroundColor: mauve.mauve3 },
  // '&:hover': { backgroundColor: mauve.mauve2 },
  '&:focus-visible': tw`border border-solid border-slate12`,
});

const StyledContent = styled(AccordionPrimitive.Content, {
  overflow: 'hidden',
  fontSize: 15,
  color: mauve.mauve11,

  '&[data-state="open"]': {
    animation: `${slideDown} 300ms cubic-bezier(0.87, 0, 0.13, 1)`,
  },
  '&[data-state="closed"]': {
    animation: `${slideUp} 300ms cubic-bezier(0.87, 0, 0.13, 1)`,
  },
});

const StyledChevron = styled(ChevronDownIcon, {
  transition: 'transform 300ms cubic-bezier(0.87, 0, 0.13, 1)',
  '[data-state=open] &': { transform: 'rotate(180deg)' },
});

// Exports
export const Accordion = StyledAccordion;
export const AccordionItem = StyledItem;
export const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  AccordionPrimitive.AccordionTriggerProps & {
    finished?: boolean;
    icon?: React.ReactNode;
    title: string;
    onOptionsClick?: () => void;
    PopoverStuff?: React.ReactNode;
  }
>(({ children, icon, title, onOptionsClick, PopoverStuff, ...props }, forwardedRef) => {
  return (
    <StyledHeader>
      <StyledTrigger {...props} ref={forwardedRef}>
        <div tw="flex items-center font-medium min-w-0">
          {icon || <StyledChevron aria-hidden tw="mr-3 flex-shrink-0" />}
          <p tw="whitespace-nowrap overflow-hidden text-left" style={{ textOverflow: 'ellipsis' }}>
            {title}
          </p>
        </div>

        <Popover>
          <PopoverTrigger
            type="button"
            tw="p-2 hover:bg-mauve5 rounded-sm transition-colors flex-shrink-0"
            onClick={(e) => {
              // Prevent accordion from closing
              e.stopPropagation();
              onOptionsClick?.();
            }}
          >
            <DotsVerticalIcon />
          </PopoverTrigger>
          <PopoverContent sideOffset={5}>{PopoverStuff}</PopoverContent>
        </Popover>
      </StyledTrigger>
    </StyledHeader>
  );
});

AccordionTrigger.displayName = 'AccordionTrigger';

export const AccordionContent = React.forwardRef<
  HTMLDivElement,
  AccordionPrimitive.AccordionContentProps
>(({ children, ...props }, forwardedRef) => (
  <StyledContent {...props} ref={forwardedRef}>
    {children}
    {/* <StyledContentText>{children}</StyledContentText> */}
  </StyledContent>
));
AccordionContent.displayName = 'AccordionContent';
