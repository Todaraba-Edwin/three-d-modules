import { defaultMenuLists, noneIcon } from '@/_common/const/routerPaths';
import { useAuthStore } from '@/_common/zustandStores/useAuthStore';
import { type ReactNode } from 'react';

export const SystemAdminHeader = (): ReactNode => {
  const { permissions } = useAuthStore();
  const findLabel = permissions.find(
    ({ path }) => path === '/system-admin'
  )?.label;
  const ICON =
    defaultMenuLists.find(({ path }) => path === '/system-admin')?.icon ||
    noneIcon;
  return (
    <div className='space-y-2'>
      <div className='flex items-center gap-3'>
        <div className='w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center'>
          <ICON className='w-5 h-5 text-white' />
        </div>
        <div>
          <h1
            className='text-2xl font-bold text-gray-900'
            children={`${findLabel}`}
          />
          <p className='text-gray-600'>사용자 및 장비 관련 설정 페이지</p>
        </div>
      </div>
    </div>
  );
};
