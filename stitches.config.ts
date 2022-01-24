import { createStitches } from '@stitches/react';

export type { CSS } from '@stitches/react/types/css-util';

export const { styled, getCssText, theme, globalCss } = createStitches({
  theme: {
    colors: {
      hiContrast: 'hsl(206,10%,5%)',
      loContrast: 'white',
    },
    fontSizes: {
      1: '13px',
      2: '15px',
      3: '17px',
    },
  },
  media: {
    sm: '(min-width: 640px)',
    md: '(min-width: 768px)',
    900: '(min-width: 900px)',
  },
});
