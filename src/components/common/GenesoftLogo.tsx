import React from 'react';
import Image from 'next/image';
import GenesoftLogo from '@public/assets/genesoft.png';

const Logo = () => {
  return (
    <div className="flex justify-center items-center">
      <Image
        src={GenesoftLogo}
        alt={'Genesoft Logo'}
        width={72}
        height={36}
        className="flex md:hidden"
      />

      <Image
        src={GenesoftLogo}
        alt={'Genesoft Logo'}
        width={96}
        height={48}
        className="hidden md:flex"
      />
    </div>
  );
};

export default Logo;
