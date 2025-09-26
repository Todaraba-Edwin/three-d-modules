import { type ReactNode } from 'react';

export const SelectedBluePoint = ({
  color = 'blue',
}: {
  color?: 'blue' | 'white';
}): ReactNode => {
  const colors = {
    ['blue']: 'bg-blue-500',
    ['white']: 'bg-white',
  };
  return (
    <div className={`w-2 h-2 rounded-full animate-pulse ${colors[color]}`} />
  );
};
