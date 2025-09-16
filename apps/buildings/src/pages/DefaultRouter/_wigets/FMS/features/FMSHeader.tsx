import { useAuthStore } from '@/common/zustandStores/useAuthStore';
import {
  defaultMenuLists,
  noneIcon,
} from '@/pages/DefaultRouter/_shared/const';
import { type ReactNode } from 'react';

export const FMSHeader = (): ReactNode => {
  const { permissions } = useAuthStore();

  const findLabel = permissions.find(({ path }) => path === '/fms')?.label;
  const ICON =
    defaultMenuLists.find(({ path }) => path === '/fms')?.icon || noneIcon;

  return (
    <div className='space-y-2'>
      <div className='flex items-center gap-3'>
        <div className='w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center'>
          <ICON className='w-5 h-5 text-white' />
        </div>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>
            {findLabel || '시설물 관리'}
          </h1>
          <p className='text-gray-600'>
            건물 내 주요 시설물을 관리하고 모니터링합니다.
          </p>
        </div>
      </div>
    </div>
  );
};
