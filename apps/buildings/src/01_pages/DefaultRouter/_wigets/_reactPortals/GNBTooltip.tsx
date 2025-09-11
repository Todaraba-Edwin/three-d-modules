import {
  useLayoutEffect,
  useState,
  type PropsWithChildren,
  type ReactNode,
  type RefObject,
} from 'react';
import { createPortal } from 'react-dom';

type GNBTooltipProps = PropsWithChildren & {
  targetRef: RefObject<HTMLElement | null>;
  weightRight: number;
};

export const GNBTooltip = ({
  children,
  weightRight,
  targetRef,
}: GNBTooltipProps): ReactNode => {
  const [position, setPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  useLayoutEffect(() => {
    if (targetRef.current) {
      const targetRect = targetRef.current.getBoundingClientRect();
      setPosition({
        top: targetRect.top + targetRect.height / 2,
        left: targetRect.right - weightRight,
      });
    }
  }, [targetRef, weightRight]);

  if (!position) return null;

  return createPortal(
    <div
      className='GNBTooltip z-[9999] absolute px-3 py-2 ml-2 bg-black text-white rounded text-sm whitespace-nowrap'
      style={{
        top: position.top,
        left: position.left,
        transform: 'translateY(-50%)',
      }}
    >
      <div className='absolute  rounded-sm top-1/2 -left-1 w-3 h-3 bg-black transform -translate-y-1/2 rotate-45'></div>
      {children}
    </div>,
    document.body
  );
};
