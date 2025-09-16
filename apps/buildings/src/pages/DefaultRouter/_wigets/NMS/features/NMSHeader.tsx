import { useAuthStore } from '@/common/zustandStores/useAuthStore';
import {
  defaultMenuLists,
  noneIcon,
} from '@/pages/DefaultRouter/_shared/const';
import { type ReactNode } from 'react';

export const NMSHeader = (): ReactNode => {
  const { permissions } = useAuthStore();

  const findLabel = permissions.find(({ path }) => path === '/nms')?.label;
  const { icon: ICON, desc } = defaultMenuLists.find(
    ({ path }) => path === '/nms'
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
          <h1
            className='text-2xl font-bold text-gray-900'
            children={`${findLabel}`}
          />
          <p className='text-gray-600'>{desc}</p>
        </div>
      </div>
    </div>
  );
};
