import { apiClient } from '@/_common/apis/apiCreate';
import { queryKey } from '@/_common/apis/queryKey';
import { Button } from '@/_common/components/Button';
import { Input } from '@/_common/components/Input';
import { useSystemAdminAddUSerStore } from '@/_common/zustandStores/useSystemAdminAddUSerStore';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Eye, EyeOff, Save, X } from 'lucide-react';
import { type ReactNode, useCallback, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Select, { type StylesConfig } from 'react-select';
import { utilsThrottle } from '../../../../../../../../../shared/src/features/_shared';
import type { PermissionsRolesQueryResult } from './LeftSectionRoleManagement';

type UserFormDateType = {
  user_id?: number | undefined;
  username: string;
  nickname: string;
  email: string;
  password: string;
  role_id:
    | {
        value: string | number;
        label: string;
      }
    | undefined;
};

type OptionType = { value: string | number; label: string };

const customSelectStyles: StylesConfig<OptionType> = {
  menu: provided => ({
    ...provided,
    borderRadius: '8px',
    overflow: 'auto',
  }),
  menuList: provided => ({
    ...provided,
    paddingTop: 0, // 옵션 상단 여백 제거
    paddingBottom: 0, // 옵션 하단 여백 제거
  }),
  option: (provided, state) => ({
    ...provided,

    cursor: 'pointer',
    backgroundColor: state.isSelected ? '#F5B18E' : ' white',
    color: state.isSelected ? 'white' : 'black',
    '&:hover': {
      backgroundColor: state.isSelected ? '#F5B18E' : '#FADED0',
      color: state.isSelected ? 'white' : 'black',
    },
  }),
  control: (provided, state) => ({
    ...provided,
    cursor: 'pointer',
    borderColor: 'white',
    boxShadow: state.isFocused ? '0 0 0 1px white' : provided.boxShadow,
    '&:hover': {
      borderColor: 'white',
    },
  }),
};

export const AddFormUser = (): ReactNode => {
  const queryClient = useQueryClient();
  const {
    isShowPassword,
    isShowAddUserNode,
    isEditModeUser,
    toggleIsShowPassword,
    closeAllStated,
  } = useSystemAdminAddUSerStore();

  const { data: permissionsResult } = useQuery<PermissionsRolesQueryResult>({
    queryKey: queryKey.systemAdmin.nm_permissionsMenuByRole(),
    queryFn: () => apiClient.get('system-admin/permissions-roles').json(),
  });

  const roleOptions =
    permissionsResult?.data
      ?.filter(({ role_code }) => role_code != 'ADMIN_MAIN')
      ?.map(({ role_id, role_name }) => ({
        value: role_id,
        label: role_name,
      })) ?? [];

  const {
    register,
    handleSubmit,
    control,
    reset,
    setError, // 1. setError 추가
    clearErrors, // 2. clearErrors 추가
    formState: { errors },
  } = useForm<UserFormDateType>({
    defaultValues: {
      user_id: undefined,
      username: '',
      nickname: '',
      email: '',
      password: '',
      role_id: undefined,
    },
  });

  const latestUsername = useRef('');
  const latestEmail = useRef('');

  const { mutate, isPending } = useMutation({
    mutationFn: (newUser: UserFormDateType) => {
      const payload = {
        ...newUser,
        role_id: newUser.role_id?.value,
      };
      return apiClient.post('users', { json: payload }).json();
    },
    onSuccess: () => {
      [queryKey.systemAdmin.users(), queryKey.systemAdmin.summary()].forEach(
        queryKey => {
          queryClient.invalidateQueries({
            queryKey,
          });
        }
      );
      reset();
    },

    onError: async () => {
      // 전체 폼 제출 에러 처리 (예: toast message)
    },
  });

  const { mutate: checkUsername } = useMutation({
    mutationFn: (username: string) => {
      return apiClient
        .post('users/check-username', { json: { username } })
        .json();
    },
    onSuccess: () => {
      // 3. 유효한 사용자명이므로, 서버 에러가 있었다면 지웁니다.

      clearErrors('username');
    },
    // eslint-disable-next-line
    onError: async (error: any, validation) => {
      // 4. 서버 에러를 username 필드 에러로 설정합니다.
      if (error.response && error.response.status === 409) {
        try {
          const errorData = await error.response.json();

          setError('username', {
            type: 'server',
            message:
              errorData.message ||
              `"${validation}"은/는 이미 사용 중에 있습니다.`,
          });
          // eslint-disable-next-line
        } catch (e) {
          setError('username', {
            type: 'server',
            message: `"${validation}"은/는 이미 사용 중에 있습니다.`,
          });
        }
      }
    },
  });

  const { mutate: checkEmail } = useMutation({
    mutationFn: (email: string) => {
      return apiClient.post('users/check-email', { json: { email } }).json();
    },
    onSuccess: () => {
      clearErrors('email');
    },
    // eslint-disable-next-line
    onError: async (error: any, validation) => {
      if (error.response && error.response.status === 409) {
        try {
          const errorData = await error.response.json();
          setError('email', {
            type: 'server',
            message:
              errorData.message ||
              `"${validation}"은/는 이미 사용 중에 있습니다.`,
          });
          // eslint-disable-next-line
        } catch (e) {
          setError('email', {
            type: 'server',
            message: `"${validation}"은/는 이미 사용 중에 있습니다.`,
          });
        }
      }
    },
  });

  const handleCheckUsername = useCallback(() => {
    if (latestUsername.current) {
      checkUsername(latestUsername.current);
    }
  }, [checkUsername]);

  const throttledCheck = utilsThrottle(
    'checkUsername',
    handleCheckUsername,
    200,
    true
  );

  const handleCheckEmail = useCallback(() => {
    if (latestEmail.current) {
      checkEmail(latestEmail.current);
    }
  }, [checkEmail]);

  const throttledCheckEmail = utilsThrottle(
    'checkEmail',
    handleCheckEmail,
    200,
    true
  );

  const onSubmit = handleSubmit(data => {
    mutate(data);
  });

  return (
    <form onSubmit={onSubmit} className='bg-orange-50 border-orange-200'>
      <div className='p-4'>
        <div className='flex items-center justify-between mb-3'>
          <h5 className='font-medium text-orange-900'>
            {isShowAddUserNode && '새 사용자 추가'}
            {isEditModeUser && '사용자 수정'}
          </h5>
          <Button
            type='button'
            variant='none'
            size='sm'
            onClick={closeAllStated}
          >
            <X className='w-4 h-4' />
          </Button>
        </div>

        <div className='space-y-1'>
          <Controller
            control={control}
            name='role_id'
            rules={{ required: '역할을 선택하세요.' }}
            render={({ field, fieldState }) => (
              <>
                <Select
                  {...field}
                  value={field.value || null}
                  styles={customSelectStyles}
                  options={roleOptions}
                  placeholder='사용자의 역할을 선택해주세요.'
                  noOptionsMessage={() => '검색 결과가 없습니다.'}
                />
                {fieldState.error && (
                  <span className='text-red-500 text-sm'>
                    {fieldState.error.message}
                  </span>
                )}
              </>
            )}
          />
        </div>
        <div className='space-y-3 mt-3'>
          <div className='grid grid-cols-2 gap-3'>
            <div className='space-y-1'>
              <label className='text-sm'>ID</label>
              <Input
                maxLength={15}
                {...register('username', {
                  required: '사용자명은 필수 항목입니다.',
                  pattern: {
                    value: /^[A-Z0-9]+$/i,
                    message:
                      '사용자명은 띄어쓰기 없는 영문과 숫자만 가능합니다.',
                  },
                  onChange: e => {
                    latestUsername.current = e.target.value;
                    throttledCheck();
                  },
                })}
                placeholder='예: user, manager(15자 이내)'
                className='text-sm'
                disabled={isEditModeUser}
              />
              {errors.username && (
                <span className='text-red-500 text-sm'>
                  {errors.username.message}
                </span>
              )}
            </div>

            <div className='space-y-1'>
              <label className='text-sm'>닉네임</label>
              <Input
                maxLength={10}
                {...register('nickname', {
                  required: '닉네임은 필수 항목입니다.',
                  pattern: {
                    value: /^[A-Z0-9ㄱ-ㅎㅏ-ㅣ가-힣]+$/i,
                    message: '닉네임은 특수문자를 포함할 수 없습니다.',
                  },
                })}
                placeholder='예: 매니저 (10자 이내)'
                className='text-sm'
              />
              {errors.nickname && (
                <span className='text-red-500 text-sm'>
                  {errors.nickname.message}
                </span>
              )}
            </div>
            <div className='space-y-1'>
              <label className='text-sm'>이메일</label>
              <Input
                {...register('email', {
                  required: '이메일은 필수 항목입니다.',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: '유효한 이메일 주소를 입력해주세요.',
                  },
                  onChange: e => {
                    latestEmail.current = e.target.value;
                    throttledCheckEmail();
                  },
                })}
                placeholder='예: user@example.com'
                className='text-sm'
                disabled={isEditModeUser}
              />
              {errors.email && (
                <span className='text-red-500 text-sm'>
                  {errors.email.message}
                </span>
              )}
            </div>
            <div className='space-y-1'>
              <label className='text-sm'>패스워드</label>
              <div className='relative'>
                <Input
                  maxLength={10}
                  type={isShowPassword ? 'text' : 'password'}
                  {...register('password', {
                    required: !isEditModeUser,
                  })}
                  placeholder='비밀번호를 입력해주세요.(10자 이내)'
                  className='text-sm pr-9'
                />
                <button
                  type='button'
                  className='absolute top-1/2 right-3 -translate-y-1/2'
                  onClick={toggleIsShowPassword}
                >
                  {isShowPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {errors.password && (
                <span className='text-red-500 text-sm'>
                  비밀번호는 필수 항목입니다.
                </span>
              )}
            </div>
          </div>
        </div>
        <div className='flex justify-end gap-2 mt-4'>
          <Button
            variant='destructive'
            type='button'
            size='sm'
            onClick={closeAllStated}
            disabled={isPending}
          >
            취소
          </Button>
          <Button
            size='sm'
            type='submit'
            disabled={isPending || !!errors.username || !!errors.email}
          >
            {isPending ? (
              '저장 중...'
            ) : (
              <>
                <Save className='w-3 h-3 mr-1' />
                {isShowAddUserNode ? '추가하기' : '수정하기'}
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};
