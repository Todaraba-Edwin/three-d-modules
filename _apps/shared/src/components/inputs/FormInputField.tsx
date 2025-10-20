import clsx from 'clsx';
import { Eye, EyeOff } from 'lucide-react';
import { useState, type ReactNode } from 'react';

type MessageType = { message: string };
type Props = React.ComponentProps<'input'> & {
  variant?: 'default' | 'none';
  label: string;
  isFullSpan?: number;
  isSuccess?: boolean;
  isError?: boolean;
  messages?: {
    success: string;
    error: string;
  };
};

const Label = ({ message }: MessageType) => {
  return <label htmlFor=''>{message}</label>;
};

const SuccessMessage = ({ message }: MessageType) => {
  return <span className='text-green-500/80'>{message}</span>;
};

const ErrorMessage = ({ message }: MessageType) => {
  return <span className='text-red-500/80'>{message}</span>;
};

export const FormInputField = ({
  label,
  variant = 'default',
  isSuccess,
  autoComplete = 'off',
  isError,
  isFullSpan,
  messages = {
    success: '유효성 통과시의 메시지를 넣어주세요.',
    error: '유효성 실패시의 메시지를 넣어주세요.',
  },
  type,
  ...rest
}: Props): ReactNode => {
  const isPassword = type === 'password';
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
  const onToggleIsShowPassword = () => setIsShowPassword(pre => !pre);
  return (
    <fieldset
      className={clsx('flex flex-col gap-y-1 text-sm', {
        [`col-span-${isFullSpan}`]: isFullSpan,
      })}
    >
      <Label message={label} />
      <p className='relative'>
        <input
          className={clsx(
            // Focus outline
            'focus:outline-none',
            'focus-visible:outline-none',

            // Placeholder
            'placeholder:text-placeholder',

            // Default Styles
            'text-input inline-flex items-center px-2 py-1',
            'w-full rounded-md',
            {
              'pr-7': isPassword,
              border: variant === 'default',
            }
          )}
          {...{
            autoComplete,
            type: isPassword ? (isShowPassword ? 'text' : 'password') : type,
            ...rest,
          }}
        />
        {isPassword && (
          <button
            type='button'
            className='absolute right-2 top-1/2 -translate-y-1/2'
            onClick={onToggleIsShowPassword}
          >
            {isShowPassword ? (
              <Eye className='h-4 w-4 text-slate-500' />
            ) : (
              <EyeOff className='h-4 w-4 text-slate-500' />
            )}
          </button>
        )}
      </p>
      {isSuccess && <SuccessMessage message={messages?.success} />}
      {isError && <ErrorMessage message={messages?.error} />}
    </fieldset>
  );
};
