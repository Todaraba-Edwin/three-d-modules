import { useSyStemAdminSelectedRole } from '@/02_common/zustandStores/useSyStemAdminSelectedRoleStore';
import clsx from 'clsx';
import { type ReactNode } from 'react';
import { GridSections } from './GridSections';
import { UM_CONST } from './const';

export const RightSectionUserManagement = (): ReactNode => {
  const { selectedRoleName } = useSyStemAdminSelectedRole();
  return (
    <GridSections
      ICON={UM_CONST.RightSection.ICON}
      sectionTitle={UM_CONST.RightSection.title}
      sectionDesc={`${selectedRoleName} ${UM_CONST.RightSection.desc}`}
      addActions={{
        addActionName: UM_CONST.RightSection.addActionName,
        addActionClick: () => {},
        addActionNode: (
          <div className='h-[600px] border-2 border-red-600'>추가로직</div>
        ),
      }}
      children={
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
          <div className='overflow-auto'>
            {Array.from({ length: 40 }, (_, idx) => idx).map(list => {
              return (
                <div
                  key={list}
                  className='p-2 grid grid-cols-[2fr_4.5fr_1.5fr]'
                >
                  <div>역할{list}</div>
                  <div>권한{list}</div>
                  <div>설정{list}</div>
                </div>
              );
            })}
          </div>
        </div>
      }
    />
  );
};
