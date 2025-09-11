import { Button } from '@/02_common/Button';
import { apiClient } from '@/02_common/apiClient';
import { queryKey } from '@/02_common/queryKey';
import { useSyStemAdminSelectedRole } from '@/02_common/zustandStores/useSyStemAdminSelectedRole';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { CircleCheckBig, CircleX, Settings, Trash2 } from 'lucide-react';
import { type ReactNode } from 'react';
import { GridSections } from './GridSections';
import { UM_CONST } from './const';

type QueryResult = {
  permissionMenu: {
    menu_id: number;
    menu_label: string;
    menu_can_access: boolean;
  }[];
  role_code: string;
  role_id: number;
  role_name: string;
  role_description: string;
};

// 유틸리티 함수
const getRoleColor = (role: string) => {
  switch (role) {
    case 'ADMIN_MAIN':
      return 'bg-red-100 text-red-800';
    case 'ADMIN_SUB':
      return 'bg-blue-100 text-blue-800';
    case 'unActive':
      return 'bg-gray-100 text-gray-400';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const Badge = ({ className, ...props }: React.ComponentProps<'span'>) => {
  return (
    <span
      data-slot='badge'
      className={clsx(
        'inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden',
        className
      )}
      {...props}
    />
  );
};

export const LeftSectionRoleManagement = (): ReactNode => {
  const { selectedRoleId, setAction } = useSyStemAdminSelectedRole();
  const { data: permissionsMenuByRoleData, isLoading } = useQuery<
    QueryResult[]
  >({
    queryKey: queryKey.systemAdmin.nm_permissionsMenuByRole(),
    queryFn: () => apiClient.get('api/system-admin/permissions-roles').json(),
  });

  console.log('permissionsMenuByRoleData', permissionsMenuByRoleData);

  return (
    <GridSections
      ICON={UM_CONST.LeftSection.ICON}
      sectionTitle={UM_CONST.LeftSection.title}
      sectionDesc={UM_CONST.LeftSection.desc}
      addActions={{
        addActionName: UM_CONST.LeftSection.addActionName,
        addActionNode: (
          <div className='h-[600px] border-2 border-red-600'>추가로직</div>
        ),
      }}
      children={
        <div
          className={clsx(
            'border-2 border-slate-300 rounded-xl grid grid-rows-[auto_1fr]',
            'overflow-scroll',
            'max-xl:h-[300px]'
          )}
        >
          <div
            className={clsx(
              'p-2 bg-slate-200 grid grid-cols-[220px_1fr_68px]',
              'text-sm'
            )}
          >
            <div className='text-center'>역할</div>
            <div className=''>권한</div>
            <div className='text-center'>설정</div>
          </div>
          <div className='overflow-auto'>
            {!isLoading &&
              permissionsMenuByRoleData?.length &&
              permissionsMenuByRoleData.map(
                ({
                  role_code,
                  role_name,
                  role_id,
                  role_description,
                  permissionMenu,
                }) => {
                  const isSelected = selectedRoleId === role_id;
                  return (
                    <div
                      key={role_id}
                      onClick={() => {
                        setAction({
                          selectedRoleId: role_id,
                          selectedRoleName: role_name,
                        });
                      }}
                      className={clsx(
                        'p-2 grid grid-cols-[220px_1fr_68px]',
                        'text-sm',
                        {
                          'hover:bg-slate-100': !isSelected,
                          'bg-blue-50': isSelected,
                          'border-b-2 border-blue-300': isSelected,
                          'border-b-2 border-slate-200': !isSelected,
                        }
                      )}
                    >
                      <div className='flex flex-col justify-center'>
                        <div className='flex items-center gap-2'>
                          <Badge
                            className={getRoleColor(role_code)}
                            children={role_name}
                          />
                          {selectedRoleId === role_id && (
                            <div className='w-2 h-2 bg-blue-500 rounded-full animate-pulse'></div>
                          )}
                        </div>
                        <div className='text-xs text-gray-500 mt-1'>
                          {role_description}
                        </div>
                      </div>
                      <div className='flex flex-wrap gap-2'>
                        {permissionMenu.map(
                          ({ menu_label, menu_can_access }, idx) => {
                            const PermissionMene = menu_can_access
                              ? CircleCheckBig
                              : CircleX;
                            return (
                              <Badge
                                key={idx}
                                className={clsx(
                                  `${getRoleColor(menu_can_access ? menu_label : 'unActive')}`,
                                  'w-fit h-fit',
                                  'space-x-2',
                                  'flex items-center'
                                )}
                                children={
                                  <>
                                    {menu_label}
                                    <PermissionMene
                                      className={clsx('w-8 h-8', {
                                        'text-green-500': menu_can_access,
                                        'text-slate-300': !menu_can_access,
                                      })}
                                    />
                                  </>
                                }
                              />
                            );
                          }
                        )}
                      </div>
                      <div className='flex flex-col justify-center'>
                        <div className='flex gap-1'>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={e => {
                              e.stopPropagation();
                              // setAction({ selectedRoleId: role_id });
                            }}
                            className='h-8 w-8 p-0'
                          >
                            <Settings className='w-3 h-3' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => {
                              // e.stopPropagation();
                              // handleDeleteRole(role);
                            }}
                            className='h-8 w-8 p-0 text-red-600 hover:text-red-700'
                            // disabled={role.name === 'admin'} // admin 역할은 삭제 불가
                          >
                            <Trash2 className='w-3 h-3' />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
          </div>
        </div>
      }
    />
  );
};
