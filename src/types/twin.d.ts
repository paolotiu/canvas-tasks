/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-duplicates */
import 'twin.macro';
import { css as cssImport, styled as s } from '@stitches/react';
import styledImport from '@stitches/react';

// Support a css prop when used with twins styled.div({}) syntax
type CSSProp<T = AnyIfEmpty<DefaultTheme>> = string | CSSObject;

declare module 'react' {
  // The css prop
  interface HTMLAttributes<T> extends DOMAttributes<T> {
    css?: CSSProp;
    tw?: string;
  }
  // The inline svg css prop
  interface SVGProps<T> extends SVGProps<SVGSVGElement> {
    css?: CSSProp;
    tw?: string;
  }
}

// Support twins styled.div({}) syntax
type StyledTags = {
  [Tag in keyof JSX.IntrinsicElements]: CreateStyledComponent<JSX.IntrinsicElements[Tag]>;
};

declare module 'twin.macro' {
  // The styled and css imports
  const styled: typeof s;
  const css: typeof cssImport;
}
