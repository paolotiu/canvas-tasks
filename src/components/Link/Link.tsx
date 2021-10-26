/* eslint-disable jsx-a11y/anchor-has-content */
import React, { ComponentPropsWithoutRef } from 'react';
import NextLink from 'next/link';

interface Props extends ComponentPropsWithoutRef<'a'> {
  href: string;
}

const Link = ({ href, ...props }: Props) => {
  return (
    <NextLink href={href} passHref>
      <a {...props} />
    </NextLink>
  );
};

export default Link;
