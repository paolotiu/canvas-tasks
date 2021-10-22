import { keyframes } from '@stitches/react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import tw, { styled } from 'twin.macro';

const slideUpAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateY(2px)' },
  '100%': { opacity: 1, transform: 'translateY(0)' },
});

const slideRightAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateX(-2px)' },
  '100%': { opacity: 1, transform: 'translateX(0)' },
});

const slideDownAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateY(-2px)' },
  '100%': { opacity: 1, transform: 'translateY(0)' },
});

const slideLeftAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateX(2px)' },
  '100%': { opacity: 1, transform: 'translateX(0)' },
});

const createAnimation = (name: { (): string }) => `${name} 400ms cubic-bezier(0.16, 1, 0.3, 1)`;
export const Content = styled(PopoverPrimitive.Content, {
  ...tw`p-4 bg-white rounded-sm shadow-xl max-w-popper text-slate12`,
  '@media (prefers-reduced-motion: no-preference)': {
    willChange: 'transform, opacity',
    '&[data-state="open"]': {
      '&[data-side="top"]': { animation: createAnimation(slideDownAndFade) },
      '&[data-side="right"]': { animation: createAnimation(slideLeftAndFade) },
      '&[data-side="bottom"]': { animation: createAnimation(slideUpAndFade) },
      '&[data-side="left"]': { animation: createAnimation(slideRightAndFade) },
    },
  },
});

export const Arrow = styled(PopoverPrimitive.Arrow, {
  fill: '#fff',
});

export const Close = styled(PopoverPrimitive.Close, {});
export const { Root, Trigger } = PopoverPrimitive;
