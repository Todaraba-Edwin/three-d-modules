import { apiClient, BMS_PATH, queryKey, uploadFile } from '@/_common/apis';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { throttle } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

type BM_BuildingCreateFormReturn = {
  watchPreviewImage: string;
  watchBuildingName: string;
  register: UseFormReturn<BM_BuildingCreateForm>['register'];
  errors: UseFormReturn<BM_BuildingCreateForm>['formState']['errors'];
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  setValue: UseFormReturn<BM_BuildingCreateForm>['setValue'];
  handleClearImage: () => void;
  isError: boolean;
  isGoingToBuildingDetail: boolean;
  onCloseConfirmPortal: () => void;
  onConfirmPortal: () => void;
};

export const useBM_RightForm = (): BM_BuildingCreateFormReturn => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
    reset,
  } = useForm<BM_BuildingCreateForm>({
    defaultValues: {},
  });

  const [throttledQuery, setThrottledQuery] = useState<string | undefined>(
    undefined
  );
  const [isGoingToBuildingDetail, setIsGoingToBuildingDetail] =
    useState<boolean>(false);

  const [createBuildingId, setCreateBuildingId] = useState<number | undefined>(
    undefined
  );

  const throttledCheckBuildingName = useMemo(
    () =>
      throttle(
        (value: string | undefined) => {
          setThrottledQuery(value);
        },
        300,
        {
          leading: false,
          trailing: true,
        }
      ),

    []
  );

  const { mutate } = useMutation({
    mutationFn: (
      reqData: BuildingCreate_ReqBodyType
    ): Promise<{
      message: string;
      createdBuildingId: number;
    }> =>
      apiClient
        .post(`${BMS_PATH.SEGMENTS.SET_BUILDINGS}`, { json: reqData })
        .json(),
  });

  const onSubmit = handleSubmit(
    data => {
      setCreateBuildingId(undefined);
      setIsGoingToBuildingDetail(false);
      setThrottledQuery(undefined);
      mutate(
        {
          buildingName: data.buildingName,
          address: data.address,
          groundFloor: Number(data.groundFloor),
          baseFloor: Number(data.baseFloor),
          latitude: Number(data.latitude),
          longitude: Number(data.longitude),
          buildingDesc: data.buildingDesc,
          buildingImage: data.presignedUrl,
        },
        {
          onSuccess: data => {
            setCreateBuildingId(data.createdBuildingId);
            // 1. 폼을 리셋
            reset();
            // 2. 목록 쿼리를 무효화
            queryClient.invalidateQueries({
              queryKey: queryKey.systemAdmin.bms_buildings(),
            });
            // 3. 상세 페이지로 이동 상태로 변경
            setIsGoingToBuildingDetail(true);
          },
        }
      );
    },
    errors => console.error('Form validation errors:', errors)
  );

  const watchFiles = watch('buildingImageUrl');
  const watchPreviewImage = watch('presignedUrl');
  const watchBuildingName = watch('buildingName');

  const handleClearImage = () => {
    ['presignedUrl', 'buildingImageUrl'].forEach(key =>
      setValue(key as keyof BM_BuildingCreateForm, '')
    );
  };

  useEffect(() => {
    if (!watchFiles || watchFiles.length === 0) return;
    const onUploadImage = async (file: File) => {
      const result = await uploadFile(file);
      setValue('presignedUrl', result.url);
    };
    const files = Array.from(watchFiles);
    files.forEach(async file => {
      onUploadImage(file);
    });
  }, [watchFiles, setValue]);

  const { isError: isExistBuildingName } = useQuery<GetBuildingsType[]>({
    queryKey: queryKey.buildings.bms_buildings_created(throttledQuery),
    queryFn: () => {
      return apiClient
        .get(BMS_PATH.SEGMENTS.CHECK_BUILDINGS, {
          searchParams: { search: throttledQuery },
        })
        .json();
    },
    enabled: !!throttledQuery,
    retry: false,
  });

  watch(({ buildingName }) => {
    throttledCheckBuildingName(buildingName);
  });

  useEffect(() => {
    if (!isExistBuildingName) {
      clearErrors('buildingName');
      return;
    }
    setError('buildingName', {
      type: 'manual',
      message: '이미 존재하는 건물명입니다.',
    });
  }, [isExistBuildingName, setError, clearErrors]);

  const onCloseConfirmPortal = () => {
    setIsGoingToBuildingDetail(false);
  };

  const onConfirmPortal = () => {
    navigate(`../${createBuildingId}`);
  };

  return {
    watchPreviewImage,
    watchBuildingName,
    onSubmit,
    isError: isExistBuildingName,
    register,
    errors,
    handleClearImage,
    setValue,
    isGoingToBuildingDetail,
    onCloseConfirmPortal,
    onConfirmPortal,
  };
};
