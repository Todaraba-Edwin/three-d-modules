import { apiClient } from '@/02_common/apiClient';
import { queryKey } from '@/02_common/queryKey';
import { useQuery } from '@tanstack/react-query';
import { type ReactNode } from 'react';
import { GridSections } from './GridSections';
import { UM_CONST } from './const';

export const LeftSectionRoleManagement = (): ReactNode => {
  const { data: permissionsMenuByRoleData, isLoading } = useQuery<any>({
    queryKey: queryKey.systemAdmin.nm_permissionsMenuByRole(),
    queryFn: () => apiClient.get('api/system-admin/permissions-roles').json(),
  });

  console.log('permissionsMenuByRoleData', permissionsMenuByRoleData);

  return (
    <GridSections
      ICON={UM_CONST.LeftSection.ICON}
      sectionTitle={UM_CONST.LeftSection.title}
      sectionDesc={UM_CONST.LeftSection.desc}
      addActions={{
        addActionName: UM_CONST.LeftSection.addActionName,
        addActionNode: (
          <div className='h-[600px] border-2 border-red-600'>추가로직</div>
        ),
      }}
      children={
        isLoading &&
        Array.from({ length: 40 }, (_, idx) => idx).map(list => {
          return (
            <div key={list} className='p-2 grid grid-cols-[2fr_4.5fr_1.5fr]'>
              <div>역할{list}</div>
              <div>권한{list}</div>
              <div>설정{list}</div>
            </div>
          );
        })
      }
    />
  );
};
