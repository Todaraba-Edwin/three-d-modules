import * as Common from '@/_common/components';
import { ConfirmPortal } from '@/pages/DefaultRouter/_wigets/_reactPortals';
import { Fragment, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBM_RightForm } from '../../../entities';
import { formInputs } from '../../../shared';
import * as BMR_UI from '../ui/BM_R';

export const BM_RightBuildingCreate = (): ReactNode => {
  const navigate = useNavigate();
  const {
    watchPreviewImage,
    watchBuildingName,
    onSubmit,
    register,
    errors,
    handleClearImage,
    setValue,
    isError,
    isGoingToBuildingDetail,
    onCloseConfirmPortal,
    onConfirmPortal,
  } = useBM_RightForm();

  return (
    <BMR_UI.FormLayout {...{ onSubmit }}>
      <BMR_UI.FormHeader children='건물 등록' />
      <BMR_UI.FormBody>
        {formInputs.map(input => {
          const isLatitudeOrLongitude =
            input.name === 'latitude' || input.name === 'longitude';
          const isBuildingName = input.name === 'buildingName';

          return (
            <Fragment key={input.name}>
              <label className='py-1' children={input.label} />
              <div>
                <Common.Input
                  type={input.type}
                  {...(input.type === 'number' && { min: 0 })}
                  {...register(input.name as keyof BM_BuildingCreateForm, {
                    required: input.required,
                  })}
                  // 5m 단위
                  {...(isLatitudeOrLongitude && {
                    step: input.step,
                    min: input.min,
                    max: input.max,
                  })}
                  placeholder={input.placeholder}
                />
                {isBuildingName &&
                  watchBuildingName &&
                  !errors[input.name as keyof BM_BuildingCreateForm] && (
                    <Common.FormSuccessMessage>
                      사용 가능한 건물명입니다.
                    </Common.FormSuccessMessage>
                  )}
                {errors[input.name as keyof BM_BuildingCreateForm] && (
                  <Common.FormErrorMessage>
                    {errors[input.name as keyof BM_BuildingCreateForm]
                      ?.message ?? '필수 입력값십니다.'}
                  </Common.FormErrorMessage>
                )}
              </div>
            </Fragment>
          );
        })}
        <label children={'건물 이미지 URL'} />
        <Common.ImageDropzone<BM_BuildingCreateForm>
          previewUrl={watchPreviewImage}
          setValue={setValue}
          clearImage={handleClearImage}
          name={'buildingImageUrl' as keyof BM_BuildingCreateForm}
        />
      </BMR_UI.FormBody>
      <BMR_UI.FormFooter>
        <Common.Button
          type='button'
          variant='destructive'
          size='lg'
          onClick={() => navigate('..')}
        >
          돌아가기
        </Common.Button>
        <Common.Button size='lg' type='submit' disabled={isError}>
          등록하기
        </Common.Button>
      </BMR_UI.FormFooter>
      {isGoingToBuildingDetail && (
        <ConfirmPortal
          title='건물 등록 완료'
          children={`건물 상세 페이지로 이동하시겠습니까?\n계속등록을 원하시면 취소를 눌러주세요.`}
          onConfirmPortal={onConfirmPortal}
          onCancel={onCloseConfirmPortal}
          isChildrenCentered
        />
      )}
    </BMR_UI.FormLayout>
  );
};
