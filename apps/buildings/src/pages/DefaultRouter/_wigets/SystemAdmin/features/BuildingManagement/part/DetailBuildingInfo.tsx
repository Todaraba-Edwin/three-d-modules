import { usePathSegments } from '@monorepo/shared';
import { type ReactNode } from 'react';

export const DetailBuildingInfo = (): ReactNode => {
  const { segments } = usePathSegments();
  const findBuildingId = parseInt(segments[3]);
  return <div children={findBuildingId} />;
};
