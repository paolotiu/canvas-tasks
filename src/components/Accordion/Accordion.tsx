import * as AccordionPrimitive from '@radix-ui/react-accordion';
import tw, { styled } from 'twin.macro';
import React from 'react';
import { keyframes } from '@stitches/react';
import { blackA, mauve, violet } from '@radix-ui/colors';
import { CheckCircledIcon, ChevronDownIcon } from '@radix-ui/react-icons';

const slideDown = keyframes({
  from: { height: 0 },
  to: { height: 'var(--radix-accordion-content-height)' },
});

const slideUp = keyframes({
  from: { height: 'var(--radix-accordion-content-height)' },
  to: { height: 0 },
});

const StyledAccordion = styled(AccordionPrimitive.Root, {
  ...tw`bg-mauve6 w-[650px] max-w-[90vw] rounded-md`,
  boxShadow: `0 2px 10px ${blackA.blackA4}`,
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
  all: 'unset',
  fontFamily: 'inherit',
  backgroundColor: 'transparent',
  padding: '0 20px',
  height: 45,
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  fontSize: 15,
  lineHeight: 1,
  color: violet.violet11,
  boxShadow: `0 1px 0 ${mauve.mauve6}`,
  '&[data-state="closed"]': { backgroundColor: 'white' },
  '&[data-state="open"]': { backgroundColor: 'white' },
  '&:hover': { backgroundColor: mauve.mauve2 },
  '&:focus-visible': tw`border border-solid border-slate12`,
});

const StyledContent = styled(AccordionPrimitive.Content, {
  overflow: 'hidden',
  fontSize: 15,
  color: mauve.mauve11,
  backgroundColor: mauve.mauve2,

  '&[data-state="open"]': {
    animation: `${slideDown} 300ms cubic-bezier(0.87, 0, 0.13, 1)`,
  },
  '&[data-state="closed"]': {
    animation: `${slideUp} 300ms cubic-bezier(0.87, 0, 0.13, 1)`,
  },
});

const StyledContentText = styled('div', {
  padding: '15px 20px',
});

const StyledChevron = styled(ChevronDownIcon, {
  color: violet.violet10,
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
  }
>(({ children, finished = false, ...props }, forwardedRef) => (
  <StyledHeader>
    <StyledTrigger {...props} ref={forwardedRef}>
      {children}
      {/* <StyledChevron aria-hidden /> */}
      {finished ? <CheckCircledIcon aria-hidden /> : <StyledChevron aria-hidden />}
    </StyledTrigger>
  </StyledHeader>
));
AccordionTrigger.displayName = 'AccordionTrigger';

export const AccordionContent = React.forwardRef<
  HTMLDivElement,
  AccordionPrimitive.AccordionContentProps
>(({ children, ...props }, forwardedRef) => (
  <StyledContent {...props} ref={forwardedRef}>
    <StyledContentText>{children}</StyledContentText>
  </StyledContent>
));
AccordionContent.displayName = 'AccordionContent';
