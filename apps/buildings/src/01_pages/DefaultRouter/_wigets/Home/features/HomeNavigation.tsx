import { defaultMenuLists, noneIcon } from '@/01_pages/DefaultRouter/_shared/const';
import { Button } from '@/02_common/Button';
import { useAuthStore } from '@/02_common/zustandStores/useAuthStore';
import { type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

export const HomeNavigation = (): ReactNode => {
  const { permissions } = useAuthStore();
  const navigate = useNavigate();
  const navigationPaths = permissions.slice(1, 5);
  /* 빠른 이동 */
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
      {navigationPaths.map(({ label, id, path }) => {
        const { icon: ICON, desc } = defaultMenuLists.find(
          ({ path: findPath }) => findPath === path
        ) || {
          icon: noneIcon,
          desc: '',
        };
        return (
          <div
            key={id}
            className='cursor-pointer hover:shadow-md transition-shadow border-slate-300 border-2 bg-white p-4 rounded-lg'
            onClick={() => navigate(path)}
          >
            <div className='pb-3'>
              <div className='flex items-center gap-2 text-base truncate'>
                <ICON className='w-5 h-5 text-blue-600' />

                <span className='truncate'>{label}</span>
              </div>
              <div className='text-sm text-gray-500 truncate'>{desc}</div>
            </div>
            <div className='pt-0'>
              <Button size='sm' className='w-full bg-black text-white'>
                <span className='truncate'>{label}로 이동</span>
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
