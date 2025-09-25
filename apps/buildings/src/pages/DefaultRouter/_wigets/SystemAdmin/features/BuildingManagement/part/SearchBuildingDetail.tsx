import { usePathSegments } from '@monorepo/shared';
import { type ReactNode } from 'react';

export const SearchBuildingDetail = (): ReactNode => {
  const { segments } = usePathSegments();
  const findBuildingId = parseInt(segments[3]);

  return <div children={findBuildingId} />;
};
