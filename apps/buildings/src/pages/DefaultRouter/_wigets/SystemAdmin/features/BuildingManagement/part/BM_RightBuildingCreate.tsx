import * as Common from '@/_common/components';
import { Fragment, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBM_RightForm } from '../../../entities';
import { formInputs } from '../../../shared';
import * as BMR_UI from '../ui/BM_R';

export const BM_RightBuildingCreate = (): ReactNode => {
  const navigate = useNavigate();
  const {
    watchPreviewImage,
    onSubmit,
    register,
    errors,
    handleClearImage,
    setValue,
  } = useBM_RightForm();

  return (
    <BMR_UI.FormLayout {...{ onSubmit }}>
      <BMR_UI.FormHeader children='건물 등록' />
      <BMR_UI.FormBody>
        {formInputs.map(input => (
          <Fragment key={input.name}>
            <label className='py-1' children={input.label} />
            <div>
              <Common.Input
                type={input.type}
                {...(input.type === 'number' && { min: 0 })}
                {...register(input.name as keyof BM_BuildingCreateForm, {
                  required: input.required,
                })}
                placeholder={input.placeholder}
              />
              {errors[input.name as keyof BM_BuildingCreateForm] && (
                <Common.FormErrorMessage>
                  {errors[input.name as keyof BM_BuildingCreateForm]?.message ??
                    '필수 입력값십니다.'}
                </Common.FormErrorMessage>
              )}
            </div>
          </Fragment>
        ))}
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
        <Common.Button size='lg' type='submit'>
          등록하기
        </Common.Button>
      </BMR_UI.FormFooter>
    </BMR_UI.FormLayout>
  );
};
