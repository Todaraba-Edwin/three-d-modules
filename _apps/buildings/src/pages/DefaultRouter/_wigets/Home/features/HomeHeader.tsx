import { menuLists, noneIcon } from '@/_common/const/routerPaths';
import { useAuthStore } from '@/_common/zustandStores/storeAuth';
import { type ReactNode } from 'react';

export const HomeHeader = (): ReactNode => {
  const { permissions } = useAuthStore();

  const findLabel = permissions.find(({ path }) => path === '/')?.label;
  const ICON = menuLists.find(({ path }) => path === '/')?.icon || noneIcon;

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
          <p className='text-gray-600'>
            테스트 대학교 본관 - 실시간 모니터링 현황
          </p>
        </div>
      </div>
    </div>
  );
};
