import {
  defaultMenuLists,
  noneIcon,
} from '@/01_pages/DefaultRouter/_shared/const';
import { Button } from '@/02_common/Button';
import { Input } from '@/02_common/Input';
import { useAuthStore } from '@/02_common/zustandStores/useAuthStore';
import { useSystemAdminAddRoleStore } from '@/02_common/zustandStores/useSystemAdminAddRoleStore';
import { Save, X } from 'lucide-react';
import { type ReactNode } from 'react';
import { useForm } from 'react-hook-form';

type RoleFormDateType = {
  role_code: string;
  role_name: string;
  role_description: string;
  permissionMenu: {
    menu_id: number;
    menu_label: string;
    menu_can_access: boolean;
  }[];
};

export const AddFormRole = (): ReactNode => {
  const { isShowAddRoleNode, isEditModeRole, closeAllStated } =
    useSystemAdminAddRoleStore(); // isShowAddRoleNode, isEditModeRole,
  const { permissions } = useAuthStore();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RoleFormDateType>({
    defaultValues: {
      permissionMenu: permissions.map(p => ({
        menu_id: p.id,
        menu_label: p.label,
        menu_can_access: false,
      })),
    },
  });
  const permissionMenu = watch('permissionMenu');

  const onSubmit = handleSubmit(
    (data, e) => console.log(data, e),
    (errors, e) => console.log(errors, e)
  );

  return (
    <form onSubmit={onSubmit} className='bg-orange-50 border-orange-200'>
      <div className='p-4'>
        {/* 해더부분 */}
        <div className='flex items-center justify-between mb-3'>
          <h5 className='font-medium text-orange-900'>
            {isShowAddRoleNode && '새 역할 추가'}
            {isEditModeRole && '관리자 권한 수정'}
          </h5>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={closeAllStated}
          >
            <X className='w-4 h-4' />
          </Button>
        </div>

        {/* 상단 제출항목 */}
        <div className='space-y-3'>
          <div className='grid grid-cols-2 gap-3'>
            <div className='space-y-1'>
              <label className='text-sm'>역할명 (영문, 대문자)</label>
              <Input
                {...register('role_code', {
                  required: '역할명(영문)은 필수 항목입니다.',
                  pattern: {
                    value: /^[A-Z_]+[A-Z]$/,
                    message: '마지막은 _로 끝날 수 없습니다.',
                  },
                  onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                    const { value } = e.target;
                    e.target.value = value
                      .toUpperCase()
                      .replace(/\s+/g, '_')
                      .replace(/[^A-Z_]/g, '');
                  },
                })}
                placeholder='예: VIEWER, VIEWER_A, VIEWER_A'
                className='text-sm'
              />
              {errors.role_code && <span>{errors.role_code.message}</span>}
            </div>

            <div className='space-y-1'>
              <label className='text-sm'>역할명 (국문)</label>
              <Input
                {...register('role_name', {
                  required: '역할명(국문)은 필수 항목입니다.',
                  pattern: {
                    value: /^[가-힣\s_-]+$/,
                    message:
                      '역할명(국문)은 한글 및 일부 특수문자(언더바, 하이픈) 입력 가능하며, 한글은 완성된 음절로 작성해주세요.',
                  },

                  onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                    const { value } = e.target;
                    e.target.value = value.replace(/[a-zA-Z0-9]/g, '');
                  },
                })}
                placeholder='예: 매니저'
                className='text-sm'
              />
            </div>
            {errors.role_name && <span>{errors.role_name.message}</span>}
          </div>
          <div className='space-y-1'>
            <label className='text-sm'>설명</label>
            <Input
              {...register('role_description')}
              placeholder='역할에 대한 설명'
              className='text-sm'
            />
          </div>
          <div className='grid grid-cols-2 gap-2 text-xs'>
            {permissions.map((module, index) => {
              const hasAccess = permissionMenu?.[index]?.menu_can_access;
              const ICON =
                defaultMenuLists.find(({ path }) => path === module.path)
                  ?.icon || noneIcon;
              return (
                <label
                  key={module.id}
                  className='flex items-center gap-2 p-2 bg-white border border-orange-200 rounded cursor-pointer hover:bg-orange-50'
                >
                  <input
                    type='checkbox'
                    {...register(`permissionMenu.${index}.menu_can_access`)}
                    className='rounded'
                  />
                  <span
                    className={`text-xs font-medium ${
                      hasAccess ? 'text-gray-900' : 'text-gray-500'
                    } inline-flex gap-2 items-center`}
                  >
                    <ICON className='w-3 h-3' />
                    {module.label}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className='flex justify-end gap-2 mt-4'>
          <Button
            variant='outline'
            type='button'
            className='bg-white hover:bg-slate-200'
            size='sm'
            onClick={closeAllStated}
          >
            취소
          </Button>
          <Button
            size='sm'
            type='submit'
            className='bg-orange-600 hover:bg-orange-700 text-white '
          >
            <Save className='w-3 h-3 mr-1' />
            {isShowAddRoleNode ? '추가하기' : '수정하기'}
          </Button>
        </div>
      </div>
    </form>
  );
};
