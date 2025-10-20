import '@fontsource/noto-sans-kr/400.css';
import '@fontsource/noto-sans-kr/700.css';
import { useMutation } from '@tanstack/react-query';
import { useCallback, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { apiClient } from './api/apiClient';
import './cesium.css';
import { FormInputField } from './components/inputs/FormInputField';
import './tailwind.css';
// import { CesiumBuilding } from './features';

function App(): ReactNode {
  // return <CesiumBuilding />;
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    clearErrors,
    setError,
    setValue,
  } = useForm<{
    name: string;
    email: string;
    password: string;
    fileList: FileList;
  }>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      fileList: undefined,
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
      clearErrors('name');
    },
    // eslint-disable-next-line
    onError: async (error: any, validation) => {
      // 4. 서버 에러를 username 필드 에러로 설정합니다.
      if (error.response && error.response.status === 409) {
        try {
          const errorData = await error.response.json();

          setError('name', {
            type: 'server',
            message:
              errorData.message ||
              `"${validation}"은/는 이미 사용 중에 있습니다.`,
          });
          // eslint-disable-next-line
        } catch (e) {
          setError('name', {
            type: 'server',
            message: `"${validation}"은/는 이미 사용 중에 있습니다.`,
          });
        }
      }
    },
  });

  const onSetFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setValue('fileList', e.target.files, {
        shouldValidate: true,
      });
    }
  };

  const handleCheckUsername = useCallback(() => {
    checkUsername(watch('name'));
  }, [checkUsername, watch]);

  const onSubmit = handleSubmit(data => {
    console.log('data', data);
  });

  return (
    <div>
      ROOT
      <form
        onSubmit={onSubmit}
        className='grid w-[600px] grid-cols-2 gap-x-2 gap-y-2 p-2'
      >
        <FormInputField
          label='이름'
          {...register('name', {
            required: '이름을 입력해주세요.',
            onChange() {
              handleCheckUsername();
            },
          })}
          type='text'
          isSuccess={Boolean(watch('name') && !errors.name)}
          isError={!!errors.name}
          messages={{
            success: '사용 가능한 ID 입니다.',
            error: errors.name?.message ?? '',
          }}
          placeholder='이름을 입력합니다.'
        />
        <FormInputField
          label='이메일'
          {...register('email', {
            required: '이메일을 입력해주세요.',
          })}
          isSuccess={Boolean(watch('email'))}
          isError={Boolean(errors.email)}
          messages={{
            success: '사용 가능한 Email 입니다.',
            error: errors.email?.message ?? '',
          }}
          placeholder='이메일을 입력합니다.'
        />

        <FormInputField
          isFullSpan={2}
          label='비밀번호'
          variant='none'
          type='password'
          {...register('password', {
            required: '비밀번호를 입력해주세요.',
          })}
          isSuccess={Boolean(watch('password'))}
          isError={Boolean(errors.password)}
          messages={{
            success: '사용 가능한 비밀번호 입니다.',
            error: errors.password?.message ?? '',
          }}
          placeholder='비밀번호을 입력합니다.'
        />

        <FormInputField
          isFullSpan={2}
          label='이미지 등록'
          type='file'
          // fileAccept={['image/*']}
          {...register('fileList', {
            required: '이미지를 등록해주세요.',
          })}
          isError={Boolean(errors.fileList)}
          messages={{
            success: '',
            error: errors.fileList?.message ?? '',
          }}
          onSetFiles={onSetFiles}
        />
        <button
          className='col-span-2 mt-2 w-full rounded-xl bg-slate-500 p-1 text-white'
          type='submit'
          children='전송'
        />
      </form>
    </div>
  );
}

export default App;
