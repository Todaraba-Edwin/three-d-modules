import { apiClient, BMS_PATH, queryKey } from '@/_common/apis';
import {
  useSuspenseQuery,
  type UseSuspenseQueryResult,
} from '@tanstack/react-query';
import { throttle } from 'lodash';
import { useMemo, useState } from 'react';
import type { UseFormWatch } from 'react-hook-form';

export const useGetBuildings = ({
  watch,
}: {
  watch: UseFormWatch<FormSearchBuildingsType>;
}): UseSuspenseQueryResult<GetBuildingsType[]> => {
  const [throttledSearch, setThrottledSearch] = useState<string | undefined>(
    undefined
  );
  const throttledSave = useMemo(
    () =>
      throttle((value: string | undefined) => setThrottledSearch(value), 300, {
        leading: false,
        trailing: true,
      }),
    []
  );

  const query = useSuspenseQuery<GetBuildingsType[]>({
    queryKey: queryKey.systemAdmin.bms_buildings(throttledSearch),
    queryFn: () =>
      apiClient
        .get(BMS_PATH.SEGMENTS.GET_BUILDINGS, {
          searchParams: { search: throttledSearch },
        })
        .json(),
  });

  watch(({ search }) => {
    throttledSave(search);
  });

  return query;
};
