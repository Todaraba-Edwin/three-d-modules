import clsx from 'clsx';
import { Eye, EyeOff } from 'lucide-react';
import { useRef, useState, type DragEvent, type ReactNode } from 'react';

type MessageType = { message: string };
type FileAcceptType =
  | 'image/*'
  | '.xlsx'
  | '.hwp'
  | '.pdf'
  | '.doc'
  | 'application/pdf'
  | 'application/msword'
  | 'application/x-hwp';
type Props = React.ComponentProps<'input'> & {
  onSetFiles?: (_e: React.ChangeEvent<HTMLInputElement>) => void;
  variant?: 'default' | 'none';
  label: string;
  fileAccept?: FileAcceptType[];
  isFullSpan?: number;
  isSuccess?: boolean;
  isError?: boolean;
  messages?: {
    success: string;
    error: string;
  };
};

const initInputStyles = (variant: Props['variant']) =>
  clsx(
    // Focus outline
    'focus:outline-none',
    'focus-visible:outline-none',

    // Placeholder
    'placeholder:text-placeholder',

    // Default Styles
    'text-input inline-flex items-center px-2 py-1',
    'w-full rounded-md',
    {
      border: variant === 'default',
    }
  );

const Label = ({ message }: MessageType) => {
  return <label htmlFor=''>{message}</label>;
};

const SuccessMessage = ({ message }: MessageType) => {
  return <span className='text-green-500/80'>{message}</span>;
};

const ErrorMessage = ({ message }: MessageType) => {
  return <span className='text-red-500/80'>{message}</span>;
};

const DefaultInput = ({
  type,
  variant,
  autoComplete,

  ...rest
}: Omit<Props, 'label' | 'isSuccess' | 'isError' | 'messages'>) => {
  return (
    <input
      className={clsx(initInputStyles(variant))}
      {...{
        autoComplete,
        type,
        ...rest,
      }}
    />
  );
};

const PasswordInput = ({
  type,
  variant,
  autoComplete,
  ...rest
}: Omit<Props, 'label' | 'isSuccess' | 'isError' | 'messages'>) => {
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
  const onToggleIsShowPassword = () => setIsShowPassword(pre => !pre);
  return (
    <p className='relative'>
      <input
        className={clsx(initInputStyles(variant), 'pr-7')}
        {...{
          autoComplete,
          type: isShowPassword ? 'text' : type,
          ...rest,
        }}
      />
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
    </p>
  );
};

const FileDropZone = ({
  onSetFiles,
  className,
  ...props
}: React.ComponentProps<'input'> & {
  onSetFiles?: Props['onSetFiles'];
}) => {
  const isImage = props.accept?.includes('image/*');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e: DragEvent<HTMLDivElement>) => {
    handleDrag(e);
  };

  const handleDragOut = (e: DragEvent<HTMLDivElement>) => {
    handleDrag(e);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    handleDrag(e);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const imageFiles = Array.from(e.dataTransfer.files).filter(file =>
        file.type.startsWith('image/')
      );
      if (imageFiles.length > 0) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(imageFiles[0]); // 단일 파일만 처리
        if (inputRef.current) {
          inputRef.current.files = dataTransfer.files;
          const changeEvent = new Event('change', { bubbles: true });
          inputRef.current.dispatchEvent(changeEvent);
        }
      }
      e.dataTransfer.clearData();
    }
  };

  const handleClick = () => {
    if (!inputRef.current) return;
    inputRef.current.click();
  };

  return (
    <figure
      className={clsx(
        'min-h-20 cursor-pointer',
        'flex flex-col items-center justify-center text-center',
        'rounded-md border border-dotted border-slate-400'
      )}
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <div>
        <p
          children={`드래그 앤 드랍 또는 클릭하여 ${isImage ? '이미지' : '파일'}를 업로드하세요.`}
        />
        {isImage && <p className='text-xs text-gray-500'>이미지 파일만 가능</p>}
      </div>
      <input
        ref={inputRef}
        className={clsx(className, 'hidden')}
        onChange={onSetFiles}
        {...props}
      />
    </figure>
  );
};

export const FormInputField = ({
  label,
  variant = 'default',
  fileAccept = ['.hwp', '.pdf', '.doc', '.xlsx'],
  isSuccess,
  autoComplete = 'off',
  isError,
  isFullSpan,
  onSetFiles,
  messages = {
    success: '유효성 통과시의 메시지를 넣어주세요.',
    error: '유효성 실패시의 메시지를 넣어주세요.',
  },
  type,
  ...rest
}: Props): ReactNode => {
  const isPassword = type === 'password';
  const isFile = type === 'file';
  return (
    <fieldset
      className={clsx('flex flex-col gap-y-1 text-sm', {
        [`col-span-${isFullSpan}`]: isFullSpan,
      })}
    >
      <Label message={label} />
      {isFile ? (
        <FileDropZone
          {...{ type }}
          {...(onSetFiles && { onSetFiles })}
          {...(isFile && fileAccept && { accept: fileAccept.join(', '), rest })}
        />
      ) : isPassword ? (
        <PasswordInput {...{ type, autoComplete, variant, ...rest }} />
      ) : (
        <DefaultInput {...{ type, autoComplete, variant, ...rest }} />
      )}

      {isSuccess && !isError && <SuccessMessage message={messages?.success} />}
      {isError && <ErrorMessage message={messages?.error} />}
    </fieldset>
  );
};
