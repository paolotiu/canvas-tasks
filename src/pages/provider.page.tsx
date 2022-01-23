import React, { useEffect } from 'react';

const Provider = () => {
  useEffect(() => {
    setTimeout(async () => {
      window.location.replace('/integrations');
    }, 2000);
  });
  return <div></div>;
};

export default Provider;
