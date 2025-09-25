import { type ReactNode } from 'react';
import { UM_CONST } from '../../shared/const';
import { SystemAdminTabLayout } from '../SystemAdminTabLayout/SystemAdminTabLayout';
import { LeftSectionRoleManagement } from './parts/LeftSectionRoleManagement';
import { RightSectionUserManagement } from './parts/RightSectionUserManagement';

export const UserManagementPage = (): ReactNode => {
  return (
    <SystemAdminTabLayout
      tabTitle={UM_CONST.Tab.title}
      tabDesc={UM_CONST.Tab.desc}
      tabBodyChildren={[
        <LeftSectionRoleManagement />,
        <RightSectionUserManagement />,
      ]}
    />
  );
};
