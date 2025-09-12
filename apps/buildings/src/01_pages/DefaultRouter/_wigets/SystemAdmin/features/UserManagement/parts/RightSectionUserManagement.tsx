import { Button } from '@/02_common/Button';
import { apiClient } from '@/02_common/apiClient';
import { queryKey } from '@/02_common/queryKey';
import { useSyStemAdminSelectedRole } from '@/02_common/zustandStores/useSyStemAdminSelectedRoleStore';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { Settings, Trash2 } from 'lucide-react';
import { type ReactNode } from 'react';
import { GridSections } from './GridSections';
import { UM_CONST } from './const';

export type UserWithRole = {
  id: number;
  username: string;
  nickname: string;
  email: string;
  last_login_at: string | null;
  role_name: string;
  role_code: string;
};

export const RightSectionUserManagement = (): ReactNode => {
  const { selectedRoleName, selectedRoleId } = useSyStemAdminSelectedRole();
  const { data: users, isLoading } = useQuery<UserWithRole[]>({
    queryKey: queryKey.systemAdmin.users(selectedRoleId),
    queryFn: () =>
      apiClient
        .get('users', {
          searchParams: {
            role_id: selectedRoleId,
          },
        })
        .json(),
  });

  return (
    <GridSections
      ICON={UM_CONST.RightSection.ICON}
      sectionTitle={UM_CONST.RightSection.title}
      sectionDesc={`${selectedRoleName} ${UM_CONST.RightSection.desc}`}
      addActions={{
        addActionName: UM_CONST.RightSection.addActionName,
        addActionClick: () => {},
        addActionNode: (
          <></>
          // <div className='h-[600px] border-2'>추가로직</div>
        ),
      }}
      children={
        <div
          className={clsx(
            'border-2 border-slate-300 rounded-xl grid grid-rows-[auto_1fr]',
            'overflow-scroll'
            // 'max-xl:h-[150px]'
          )}
        >
          <div className='p-2 bg-blue-100 grid grid-cols-[200px_100px_1fr_80px] text-sm font-medium'>
            <div className='text-center'>사용자</div>
            <div className='text-center'>권한(역할)</div>
            <div className='text-center'>마지막 로그인</div>
            <div className='text-center'>작업</div>
          </div>
          <div className='overflow-auto'>
            {!isLoading &&
              users?.map(user => {
                const isAdminMain = user.role_code === 'ADMIN_MAIN';
                return (
                  <div
                    key={user.id}
                    className='p-2 grid grid-cols-[200px_100px_1fr_80px] text-sm border-b border-slate-200'
                  >
                    <div className='flex flex-col justify-center px-2'>
                      <p className='font-semibold'>
                        {user.username} ({user.nickname})
                      </p>
                      <p className='text-xs text-gray-500'>{user.email}</p>
                    </div>
                    <div className='flex items-center justify-start'>
                      {user.role_name}
                    </div>
                    <div className='flex items-center justify-center text-xs'>
                      {user.last_login_at
                        ? new Date(user.last_login_at).toLocaleString()
                        : 'N/A'}
                    </div>
                    <div className='flex items-center gap-1'>
                      <Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
                        <Settings className='w-3 h-3' />
                      </Button>
                      {!isAdminMain && (
                        <Button
                          variant='ghost'
                          size='sm'
                          className='h-8 w-8 p-0 text-red-600 hover:text-red-700'
                        >
                          <Trash2 className='w-3 h-3' />
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      }
    />
  );
};
