import { Button } from '@/_common/components/Button';
import clsx from 'clsx';
import { Plus } from 'lucide-react';
import { type PropsWithChildren, type ReactNode } from 'react';

type Props = PropsWithChildren & {
  ICON: LucideIconType;
  sectionTitle: string;
  sectionDesc: string;
  addActions: {
    addActionName: string;
    addActionClick: () => void;
    addActionNode: ReactNode;
  };
};

export const GridSections = ({
  children,
  ICON,
  sectionTitle,
  // sectionDesc,
  addActions,
}: Props): ReactNode => {
  return (
    <div
      className={clsx(
        'grid grid-rows-[auto_auto_1fr] gap-y-2'
        // 'border-2 border-slate-300 rounded-xl p-4'
      )}
    >
      {/* 헤더 */}
      <div>
        <div className='flex items-center gap-2'>
          <ICON className='h-4 w-4' />
          {sectionTitle}
        </div>
        {/* <div children={sectionDesc} /> */}
      </div>

      {/* 역할 추가로직 */}
      <div className='space-y-2'>
        <Button
          onClick={addActions.addActionClick}
          size='sm'
          className='bg-purple-600 text-white hover:bg-purple-700'
        >
          <Plus className='h-4 w-4' />
          {addActions.addActionName}
        </Button>
        {addActions.addActionNode}
      </div>

      {/* 도표부분 */}
      {children}
    </div>
  );
};
