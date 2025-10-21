import clsx from 'clsx';
import { CircleX, Eye, EyeOff } from 'lucide-react';
import { useRef, useState, type DragEvent, type ReactNode } from 'react';

const VITE_IMG_SERVER = import.meta.env.VITE_IMG_SERVER ?? '';
const StorybookPreImage = 'http://localhost:3000';

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
  isStorybook?: boolean;
  variant?: 'default' | 'none';
  preSignedUrls?: string[];
  maxFileWidth?: number;
  onRemoveFile?: (_parameter: { targetUrl: string }) => undefined;
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
  isStorybook,
  preSignedUrls,
  maxFileWidth,
  onRemoveFile = () => {},
  className,
  ...props
}: React.ComponentProps<'input'> & {
  maxFileWidth: Props['maxFileWidth'];
  isStorybook: Props['isStorybook'];
  preSignedUrls: Props['preSignedUrls'];
  onRemoveFile: Props['onRemoveFile'];
}) => {
  const isMultiple = props.multiple;
  const isImage = props.accept?.includes('image/*');
  const inputRef = useRef<HTMLInputElement>(null);
  const { ref: rhfRef, ...restProps } = props;

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
      const droppedFiles = Array.from(e.dataTransfer.files);
      if (droppedFiles.length > 0 && inputRef.current) {
        const dataTransfer = new DataTransfer();
        droppedFiles.forEach(file => dataTransfer.items.add(file));
        inputRef.current.files = dataTransfer.files;
        const changeEvent = new Event('change', { bubbles: true });
        inputRef.current.dispatchEvent(changeEvent);
      }
      e.dataTransfer.clearData();
    }
  };

  const handleClick = () => {
    if (!inputRef.current) return;
    inputRef.current.click();
  };

  const onRemoveFileButton =
    ({ targetUrl }: { targetUrl: string }) =>
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.stopPropagation();
      onRemoveFile({ targetUrl });
    };

  return (
    <figure
      className={clsx(
        'min-h-20 cursor-pointer p-4',
        'flex flex-col items-center justify-center gap-3',
        'rounded-md border border-dotted border-slate-400',
        'text-center'
      )}
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <div>
        <p
          children={`드래그 앤 드랍 또는 클릭하여 ${
            isImage ? '이미지' : '파일'
          }를 업로드하세요.`}
        />
        {isImage && <p className='text-xs text-gray-500'>이미지 파일만 가능</p>}
      </div>
      <input
        ref={instance => {
          // Assign to local ref
          (inputRef as React.RefObject<HTMLInputElement | null>).current =
            instance;
          // Call RHF's ref
          if (typeof rhfRef === 'function') {
            rhfRef(instance);
          } else if (rhfRef) {
            (rhfRef as React.RefObject<HTMLInputElement | null>).current =
              instance;
          }
        }}
        className={clsx(className, 'hidden')}
        {...restProps}
      />
      <div
        className={clsx('cursor-default', {
          'grid-cols-3': isMultiple,
          'grid-cols-1': !isMultiple,
          'grid gap-x-4 gap-y-4': preSignedUrls?.length,
          [`max-w-[${maxFileWidth}]`]: maxFileWidth,
        })}
        onClick={(e: React.MouseEvent<HTMLElement, MouseEvent>) =>
          e.stopPropagation()
        }
      >
        {preSignedUrls?.length
          ? preSignedUrls.map((list, idx) => (
              <figure
                key={list + idx}
                className='relative h-fit overflow-hidden rounded-md'
              >
                <img
                  {...(isStorybook
                    ? { src: `${StorybookPreImage}/${list}` }
                    : { src: `${VITE_IMG_SERVER}${list}` })}
                  //   src={`${VITE_IMG_SERVER}${list}`}
                  //   onError={e => {
                  //     e.currentTarget.src = '/imgs/no-image.png';
                  //   }}
                />
                <button
                  className='absolute right-1 top-1 h-5 w-5 rounded-full bg-black/50 text-white shadow-2xl'
                  type='button'
                  onClick={onRemoveFileButton({ targetUrl: list })}
                >
                  <CircleX className='h-5 w-5 font-bold' />
                </button>
              </figure>
            ))
          : null}
      </div>
    </figure>
  );
};

export const FormInputField = ({
  label,
  variant = 'default',
  preSignedUrls,
  isStorybook,
  onRemoveFile,
  fileAccept = ['.hwp', '.pdf', '.doc', '.xlsx'],
  maxFileWidth,
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
          {...{
            type,
            ...rest,
            preSignedUrls,
            onRemoveFile,
            isStorybook,
            maxFileWidth,
          }}
          {...(isFile && fileAccept && { accept: fileAccept.join(', ') })}
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
