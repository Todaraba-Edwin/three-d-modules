import { usePathSegments } from '@monorepo/shared';
import { Mouse } from 'lucide-react';
import { type ReactNode } from 'react';

export const SearchBuildingNone = (): ReactNode => {
  return (
    <div className='border-2 rounded-lg flex flex-col space-y-2 items-center justify-center'>
      <p>왼쪽에서 건물동을 선택해주세요.</p>
      <Mouse className='w-10 h-10' />
    </div>
  );
};

export const SearchBuildingDetail = (): ReactNode => {
  const { segments } = usePathSegments();
  const findBuildingId = parseInt(segments[3]);

  return <div children={findBuildingId} />;
};
