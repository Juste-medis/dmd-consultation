import React from 'react';
import Hero from './Hero';
import Presentation from './Presentations';
import Cookies from 'universal-cookie';

const Landing = () => {
  const cookies = new Cookies();
  const _u = cookies.get('___lo_rery_yap')?.substring(39);
  return (
    <>
      <Hero _u={_u} />
      <Presentation />
    </>
  );
};

export default Landing;
