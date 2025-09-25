import { type ReactNode } from 'react';
import { BM_CONST } from '../../shared';
import { SystemAdminTabLayout } from '../SystemAdminTabLayout';
import { SearchBuildings } from './part';

export const BuildingManagementOutlet = (): ReactNode => {
  return (
    <SystemAdminTabLayout
      tabTitle={BM_CONST.Tab.title}
      tabDesc={BM_CONST.Tab.desc}
      tabBodyGridType='custom'
      tabBodyChildren={[<SearchBuildings />]}
    />
  );
};
