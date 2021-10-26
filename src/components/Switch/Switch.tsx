import { styled } from '@stitches/react';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import { useId } from '@radix-ui/react-id';
import tw from 'twin.macro';

const StyledSwitch = styled(SwitchPrimitive.Root, {
  all: 'unset',
  width: 36,
  height: 20,
  WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
  ...tw`relative rounded-full cursor-pointer bg-mauve8`,
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
  const id = useId();
  return (
    <StyledSwitch id={id} {...props}>
      <StyledThumb />
    </StyledSwitch>
  );
};

export default Switch;
