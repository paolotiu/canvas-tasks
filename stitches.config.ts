import { createStitches } from '@stitches/react';

export type { CSS } from '@stitches/react/types/css-util';

export const { styled, getCssText, theme, globalCss } = createStitches({
  theme: {
    fonts: {
      system: 'Inter',
    },
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
});
