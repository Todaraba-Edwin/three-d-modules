import { type ReactNode } from 'react';
import { SystemAdminTabLayout } from '../SystemAdminTabLayout/SystemAdminTabLayout';
import { LeftSectionRoleManagement } from './parts/LeftSectionRoleManagement';
import { RightSectionUserManagement } from './parts/RightSectionUserManagement';
import { UM_CONST } from './parts/const';

export const UserManagement = (): ReactNode => {
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
