import { useForm, type UseFormReturn } from 'react-hook-form';

export const useFormSearchBuilding =
  (): UseFormReturn<FormSearchBuildingsType> => {
    const form = useForm<FormSearchBuildingsType>({
      defaultValues: {
        search: '',
      },
    });
    return form;
  };
