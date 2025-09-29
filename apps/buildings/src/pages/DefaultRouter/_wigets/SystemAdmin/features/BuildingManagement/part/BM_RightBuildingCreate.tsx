import { FormErrorMessage, ImageDropzone, Input } from '@/_common/components';
import { Fragment, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBM_RightForm } from '../../../entities';
import { formInputs } from '../../../shared';
import { BMR_Comp } from '../ui';

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
    <BMR_Comp.FormLayout {...{ onSubmit }}>
      <BMR_Comp.FormHeader children='건물 등록' />
      <BMR_Comp.FormBody>
        {formInputs.map(input => (
          <Fragment key={input.name}>
            <label className='py-1' children={input.label} />
            <div>
              <Input
                type={input.type}
                {...(input.type === 'number' && { min: 0 })}
                {...register(input.name as keyof BM_BuildingCreateForm, {
                  required: input.required,
                })}
                placeholder={input.placeholder}
              />
              {errors[input.name as keyof BM_BuildingCreateForm] && (
                <FormErrorMessage>
                  {errors[input.name as keyof BM_BuildingCreateForm]?.message ??
                    '필수 입력값십니다.'}
                </FormErrorMessage>
              )}
            </div>
          </Fragment>
        ))}
        <label children={'건물 이미지 URL'} />
        <ImageDropzone<BM_BuildingCreateForm>
          previewUrl={watchPreviewImage}
          setValue={setValue}
          clearImage={handleClearImage}
          name={'buildingImageUrl' as keyof BM_BuildingCreateForm}
        />
      </BMR_Comp.FormBody>
      <BMR_Comp.FormFooter>
        <button type='button' onClick={() => navigate('..')}>
          돌아가기
        </button>
        <button type='submit'>등록하기</button>
      </BMR_Comp.FormFooter>
    </BMR_Comp.FormLayout>
  );
};
