import { styled } from '@stitches/react';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import tw from 'twin.macro';

const StyledSwitch = styled(SwitchPrimitive.Root, {
  all: 'unset',
  width: 36,
  height: 20,
  WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
  ...tw`relative rounded-full cursor-pointer bg-mauve8`,
  '&:focus': { boxShadow: `0 0 0 2px black` },
  '&[data-state="checked"]': tw`bg-gray-800`,
});

const StyledThumb = styled(SwitchPrimitive.Thumb, {
  height: 16,
  width: 16,
  transform: 'translateX(2px)',
  willChange: 'transform',
  ...tw`block transition-transform bg-white rounded-full`,
  '&[data-state="checked"]': { transform: 'translateX(18px)' },
});

interface Props extends SwitchPrimitive.SwitchProps {}
const Switch = (props: Props) => {
  return (
    <StyledSwitch {...props}>
      <StyledThumb />
    </StyledSwitch>
  );
};

export default Switch;
