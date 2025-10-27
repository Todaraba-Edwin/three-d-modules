import { ResponseError } from '@/_common/components/ResponseError';
import { type ReactNode } from 'react';
import { BM_CONST } from '../../shared';
import { SystemAdminTabLayout } from '../SystemAdminTabLayout';
import { BuildingManagementLayout } from './BuildingManagementLayout';

export const BuildingManagementOutlet = (): ReactNode => {
  return (
    <SystemAdminTabLayout
      tabTitle={BM_CONST.Tab.title}
      tabDesc={BM_CONST.Tab.desc}
      tabBodyGridType='custom'
      tabBodyChildren={[
        <ResponseError children={<BuildingManagementLayout />} />,
      ]}
    />
  );
};
