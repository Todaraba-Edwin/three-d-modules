import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { type PropsWithChildren, type ReactNode } from 'react';

type Props = PropsWithChildren & {
  is3DmsMode: boolean;
  isMobileMode: boolean;
  isGnbOpen: boolean;
  onToggleIsGnbOpen: () => void;
};

const OutletHeader = ({
  isGnbOpen,
  isMobileMode,
  onToggleIsGnbOpen,
}: {
  isMobileMode: boolean;
  isGnbOpen: boolean;
  onToggleIsGnbOpen: () => void;
}): ReactNode => {
  return (
    <div className='bg-white  h-12 p-4 flex items-center gap-2'>
      {!isMobileMode && (
        <button onClick={onToggleIsGnbOpen}>
          {isGnbOpen ? <PanelLeftClose /> : <PanelLeftOpen />}
        </button>
      )}
      <p className='font-bold text-lg'>
        PRIZM <span className='font-thin text-'>건물관리 시스템</span>
      </p>
    </div>
  );
};

const OutletBody = ({ children }: PropsWithChildren): ReactNode => {
  return <div className='overflow-y-auto p-4'>{children}</div>;
};

export const OutletSection = ({
  is3DmsMode,
  isMobileMode,
  isGnbOpen,
  onToggleIsGnbOpen,
  children,
}: Props): ReactNode => {
  const noneTopOutletHeader = is3DmsMode;

  if (noneTopOutletHeader) <>{children}</>;
  return (
    <section className='flex-grow grid grid-rows-[auto_1fr]'>
      <OutletHeader
        {...{
          isMobileMode,
          isGnbOpen,
          onToggleIsGnbOpen,
        }}
      />
      <OutletBody {...{ children }} />
    </section>
  );
};
