import { Button } from '@/02_common/Button';
import clsx from 'clsx';
import { Plus } from 'lucide-react';
import { type PropsWithChildren, type ReactNode } from 'react';

type Props = PropsWithChildren & {
  ICON: LucideIconType;
  sectionTitle: string;
  sectionDesc: string;
  addActions: {
    addActionName: string;
    addActionNode: ReactNode;
  };
};

export const GridSections = ({
  children,
  ICON,
  sectionTitle,
  sectionDesc,
  addActions,
}: Props): ReactNode => {
  return (
    <div className='border-2 border-slate-300 rounded-xl p-4 grid grid-rows-[auto_auto_1fr] gap-y-2'>
      {/* 헤더 */}
      <div>
        <div className='flex items-center gap-2'>
          <ICON className='w-4 h-4' />
          {sectionTitle}
        </div>
        <div children={sectionDesc} />
      </div>

      {/* 역할 추가로직 */}
      <div>
        <Button
          onClick={() => {}}
          disabled={false}
          size='sm'
          className='bg-purple-600 hover:bg-purple-700 text-white'
        >
          <Plus className='w-4 h-4' />
          {addActions.addActionName}
        </Button>
        {addActions.addActionNode}
      </div>

      {/* 도표부분 */}
      <div
        className={clsx(
          'border-2 border-slate-300 rounded-xl grid grid-rows-[auto_1fr]',
          'overflow-scroll',
          'max-xl:h-[150px]'
        )}
      >
        <div className='p-2 bg-blue-100 grid grid-cols-[2fr_4.5fr_1.5fr]'>
          <div>역할</div>
          <div>권한</div>
          <div>설정</div>
        </div>
        <div className='overflow-auto'>{children}</div>
      </div>
    </div>
  );
};
