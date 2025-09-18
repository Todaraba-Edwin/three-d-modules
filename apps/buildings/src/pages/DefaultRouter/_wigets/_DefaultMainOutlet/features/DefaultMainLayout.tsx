import { type PropsWithChildren, type ReactNode } from 'react';

export const DefaultMainLayout = ({
  children,
}: PropsWithChildren): ReactNode => {
  return (
    <div
      {...{
        className: 'DefaultMainOutletLayout',
        children,
      }}
    />
  );
};
