import {
  defaultMenuLists,
  noneIcon,
} from '@/01_pages/DefaultRouter/_shared/const';
import { useAuthStore } from '@/02_common/zustandStores/useAuthStore';
import { type ReactNode } from 'react';

export const SystemInfoHeader = (): ReactNode => {
  const { permissions } = useAuthStore();

  const findLabel = permissions.find(
    ({ path }) => path === '/system-info'
  )?.label;
  const { icon: ICON, desc } = defaultMenuLists.find(
    ({ path }) => path === '/system-info'
  ) || {
    icon: noneIcon,
    desc: '',
  };

  return (
    <div className='space-y-2'>
      <div className='flex items-center gap-3'>
        <div className='w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center'>
          <ICON className='w-5 h-5 text-white' />
        </div>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>
            {findLabel || '시스템 정보'}
          </h1>
          <p className='text-gray-600'>{desc}</p>
        </div>
      </div>
    </div>
  );
};
