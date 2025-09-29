import { uploadFile } from '@/_common/apis';
import { useEffect } from 'react';
import { useForm, type UseFormReturn } from 'react-hook-form';

type BM_BuildingCreateFormReturn = {
  watchPreviewImage: string;
  register: UseFormReturn<BM_BuildingCreateForm>['register'];
  errors: UseFormReturn<BM_BuildingCreateForm>['formState']['errors'];
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  setValue: UseFormReturn<BM_BuildingCreateForm>['setValue'];
  handleClearImage: () => void;
};

export const useBM_RightForm = (): BM_BuildingCreateFormReturn => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BM_BuildingCreateForm>({
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

  const handleClearImage = () => {
    ['presignedUrl', 'buildingImageUrl'].forEach(key =>
      setValue(key as keyof BM_BuildingCreateForm, '')
    );
  };

  useEffect(() => {
    if (!watchFiles || watchFiles.length === 0) return;
    const onUploadImage = async (file: File) => {
      const result = await uploadFile(file);
      setValue('presignedUrl', result.tempUrl);
    };
    const files = Array.from(watchFiles);
    files.forEach(async file => {
      onUploadImage(file);
    });
  }, [watchFiles, setValue]);
  return {
    watchPreviewImage,
    onSubmit,
    register,
    errors,
    handleClearImage,
    setValue,
  };
};
