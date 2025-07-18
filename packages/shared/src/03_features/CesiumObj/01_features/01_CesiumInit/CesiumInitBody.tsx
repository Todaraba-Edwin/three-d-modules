import { type PropsWithChildren, type ReactNode } from 'react';

type Props = PropsWithChildren & {
  containerRef: React.RefObject<HTMLDivElement | null>;
};
export const CesiumInitBody = ({
  children,
  containerRef,
}: Props): ReactNode => {
  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '100vh', position: 'relative' }}
    >
      {children}
    </div>
  );
};
