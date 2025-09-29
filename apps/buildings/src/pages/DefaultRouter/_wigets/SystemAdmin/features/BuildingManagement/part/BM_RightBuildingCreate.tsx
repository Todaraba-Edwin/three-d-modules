import { uploadFile } from '@/_common/apis';
import { Input } from '@/_common/components';
import { ImageDropzone } from '@/_common/components/ImageDropzone';
import {
  Fragment,
  useEffect,
  type PropsWithChildren,
  type ReactNode,
} from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { formInputs } from '../../../shared/buildingCreateConst';

export type BM_BuildingCreateForm = {
  buildingName: string;
  buildingDesc: string;
  address: string;
  buildingImageUrl: FileList;
  groundFloor: number;
  baseFloor: number;
  latitude: number;
  longitude: number;
  presignedUrl: string;
};

const Component = {
  Layout: ({
    children,
    ...props
  }: PropsWithChildren & React.ComponentProps<'form'>) => {
    return (
      <form
        {...props}
        className='p-4 border-2 rounded-lg min-h-0 grid grid-rows-[auto_1fr_auto] gap-2'
        {...{ children }}
      />
    );
  },
};

export const BM_RightBuildingCreate = (): ReactNode => {
  const navigate = useNavigate();
  const { register, handleSubmit, watch, setValue } =
    useForm<BM_BuildingCreateForm>({
      defaultValues: {},
    });

  const onSubmit = handleSubmit(
    data => {
      console.log('data', data);
    },
    errors => console.error('Form validation errors:', errors)
  );

  const watchFiles = watch('buildingImageUrl');
  const watchPreviewImage = watch('presignedUrl');

  useEffect(() => {
    if (!watchFiles || watchFiles.length === 0) return;
    const files = Array.from(watchFiles);
    files.forEach(async file => {
      try {
        const result = await uploadFile(file);
        setValue('presignedUrl', result.tempUrl);
        // 👉 이 url을 react-hook-form 값에 다시 setValue 해두면 DB 저장 시 바로 사용 가능
        // setValue('buildingImageUrl', result.url)
      } catch (err) {
        console.error('업로드 실패', err);
      }
    });
  }, [watchFiles]);

  return (
    <Component.Layout {...{ onSubmit }}>
      <h2
        className='text-lg font-semibold text-gray-900'
        children='건물 생성'
      />
      <div className='gap-y-2 grid grid-cols-[140px_1fr] min-h-0 h-fit items-start'>
        {formInputs.map(input => (
          <Fragment key={input.name}>
            <label className='py-1' children={input.label} />
            {input.type === 'file' ? (
              <ImageDropzone<BM_BuildingCreateForm>
                setValue={setValue}
                name={input.name as keyof BM_BuildingCreateForm}
              />
            ) : (
              <Input
                type={input.type}
                {...(input.type === 'number' && { min: 0 })}
                {...register(input.name as keyof BM_BuildingCreateForm)}
                placeholder={input.placeholder}
              />
            )}
          </Fragment>
        ))}
        <label children={'건물 이미지 URL'} />
        <ImageDropzone<BM_BuildingCreateForm>
          previewUrl={watchPreviewImage}
          setValue={setValue}
          name={'buildingImageUrl' as keyof BM_BuildingCreateForm}
        />
      </div>
      <div className='flex space-x-2 justify-center items-center'>
        <button type='button' onClick={() => navigate('..')}>
          돌아가기
        </button>
        <button type='submit'>등록하기</button>
      </div>
    </Component.Layout>
  );
};
