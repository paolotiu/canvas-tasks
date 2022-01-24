import React from 'react';
import tw, { styled } from 'twin.macro';

interface Props {
  children: React.ReactNode;
}

const GuideWrapper = styled('div', {
  ...tw`relative overflow-hidden`,
  '.guides': {
    ...tw`absolute top-0 left-0 w-full h-full`,
  },
  '.lines-container': {
    ...tw`relative grid h-full grid-cols-2 mx-4 900:mx-12`,

    '@900': {
      ...tw`grid-cols-4`,
    },
    '@sm': {
      '*:nth-child(3)': {
        display: 'block',
      },
    },
  },
  '*:nth-child(2)': {
    zIndex: 1,
    position: 'relative',
  },
});

const GridLine = styled('div', {
  '--line-color': '#dcdbdd',
  ...tw`w-[1px]`,
  backgroundImage:
    'linear-gradient(180deg, var(--line-color), var(--line-color) 50%, transparent 50%, transparent)',
  backgroundSize: '1px 8px',
  '&:last-child': {
    ...tw`absolute top-0 right-0 h-full`,
  },

  '&:nth-of-type(2n)': {
    display: 'none',

    '@900': {
      display: 'block',
    },
  },
  '&:nth-of-type(3)': {
    display: 'none',
    '@sm': {
      display: 'block',
    },
  },
});

const GuideLines = ({ children }: Props) => {
  return (
    <GuideWrapper>
      <div className="guides">
        <div className="lines-container">
          <GridLine />
          <GridLine />
          <GridLine />
          <GridLine />
          <GridLine />
        </div>
      </div>
      {children}
    </GuideWrapper>
  );
};

export default GuideLines;
