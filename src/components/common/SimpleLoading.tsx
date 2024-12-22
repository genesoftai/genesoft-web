import React from 'react';
import { MoonLoader } from 'react-spinners';

interface SimpleLoadingProps {
  color?: string;
  size?: number;
}

const SimpleLoading: React.FC<SimpleLoadingProps> = ({
  color = '#000000',
  size = 10,
}) => {
  return (
    <div>
      <MoonLoader size={size} color={color} />
    </div>
  );
};

export default SimpleLoading;
