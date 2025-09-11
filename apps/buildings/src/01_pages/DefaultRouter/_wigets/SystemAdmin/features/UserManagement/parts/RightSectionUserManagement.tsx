import { type ReactNode } from 'react';
import { GridSections } from './GridSections';
import { UM_CONST } from './const';

export const RightSectionUserManagement = (): ReactNode => {
  return (
    <GridSections
      ICON={UM_CONST.RightSection.ICON}
      sectionTitle={UM_CONST.RightSection.title}
      sectionDesc={UM_CONST.RightSection.desc}
      addActions={{
        addActionName: UM_CONST.RightSection.addActionName,
        addActionNode: (
          <div className='h-[600px] border-2 border-red-600'>추가로직</div>
        ),
      }}
      children={Array.from({ length: 40 }, (_, idx) => idx).map(list => {
        return (
          <div key={list} className='p-2 grid grid-cols-[2fr_4.5fr_1.5fr]'>
            <div>역할{list}</div>
            <div>권한{list}</div>
            <div>설정{list}</div>
          </div>
        );
      })}
    />
  );
};
