import clsx from 'clsx';
import { X } from 'lucide-react';
import { useRef, useState, type DragEvent, type ReactNode } from 'react';
import {
  type FieldValues,
  type Path,
  type UseFormSetValue,
} from 'react-hook-form';
const VITE_API_URL = import.meta.env.VITE_API_URL;

interface ImageDropzoneProps<T extends FieldValues> {
  setValue: UseFormSetValue<T>;
  previewUrl?: string;
  name: Path<T>;
}

export const ImageDropzone = <T extends FieldValues>({
  setValue,
  previewUrl = '',
  name,
}: ImageDropzoneProps<T>): ReactNode => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e: DragEvent<HTMLDivElement>) => {
    handleDrag(e);
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragOut = (e: DragEvent<HTMLDivElement>) => {
    handleDrag(e);
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    handleDrag(e);
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const imageFiles = Array.from(e.dataTransfer.files).filter(file =>
        file.type.startsWith('image/')
      );
      if (imageFiles.length > 0) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(imageFiles[0]); // 단일 파일만 처리
        setValue(name, dataTransfer.files as any, { shouldValidate: true });
      }
      e.dataTransfer.clearData();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setValue(name, e.target.files as any, { shouldValidate: true });
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  console.log('previewUrl', previewUrl);

  return (
    <div
      className={clsx(
        `relative border-2 border-dashed rounded-lg text-center transition-all duration-200 min-h-40 ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }  flex justify-center items-center cursor-pointer`,

        {
          'grid grid-cols-[1fr_200px]': previewUrl,
          'max-lg:grid-cols-[1fr]': previewUrl,
          'grid grid-cols-[1fr]': !previewUrl,
        }
      )}
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <div
        className={clsx('p-6', {
          'max-lg:pb-2': previewUrl,
        })}
      >
        <input
          type='file'
          ref={inputRef}
          className='hidden'
          accept='image/*'
          onChange={handleInputChange}
        />
        <div>
          <p>드래그 앤 드랍 또는 클릭하여 이미지를 업로드하세요.</p>
          <p className='text-xs text-gray-500'>이미지 파일만 가능</p>
        </div>
      </div>
      {previewUrl && (
        <div className='relative w-fit mx-auto flex justify-center items-center p-2'>
          <img
            className='h-fit w-full max-w-[200px] object-contain object-center rounded-lg'
            src={`${VITE_API_URL}${previewUrl}`}
            alt='이미지 미리보기'
          />
          <button
            type='button'
            className='absolute top-4 right-4 bg-white rounded-full text-red-500 w-6 h-6 border-2 flex items-center justify-center'
            onClick={e => {
              e.stopPropagation();
              ['presignedUrl', 'buildingImageUrl'].forEach(key =>
                setValue(key as Path<T>, '' as any)
              );
            }}
          >
            <X className='w-4 h-4 font-bold' />
          </button>
        </div>
      )}
    </div>
  );
};
