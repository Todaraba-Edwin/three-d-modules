import { SelectedBluePoint } from '@/_common/components';
import { usePathSegments } from '@_shared';
import clsx from 'clsx';
import { Building2, TextSearch } from 'lucide-react';
import { type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

type Props = {
  content: GetBuildingsType;
};

export const EmptyBuilding = (): ReactNode => {
  return (
    <div className=' flex gap-2 justify-center mt-2 text-slate-500'>
      <TextSearch />
      <span>건물 정보를 찾을 수 없습니다</span>
    </div>
  );
};

export const SearchBuildingList = ({
  content: { id, buildingName, address },
}: Props): ReactNode => {
  const { segments } = usePathSegments();
  const selectedBuildingId = parseInt(segments[3]) ?? 0;
  const isSelected = selectedBuildingId === parseInt(id);
  const navigate = useNavigate();
  const onNavigate = (id: string) => () => {
    if (isSelected) {
      navigate(`/${[...segments.slice(1, 3)].join('/')}`);
      return;
    }
    navigate(id.toString());
  };

  return (
    <li>
      <button
        onClick={onNavigate(id)}
        className={clsx(
          'border-2 rounded-lg grid grid-cols-[auto_1fr] space-x-4 w-full items-center p-2',
          { 'bg-blue-50 border-blue-400': isSelected },
          { 'hover:bg-slate-100': !isSelected }
        )}
      >
        <figure className='relative'>
          <Building2 className='text-slate-400 ml-2' />
          {isSelected && (
            <div className=' absolute -top-1 left-0'>
              <SelectedBluePoint />
            </div>
          )}
        </figure>
        <span className='flex flex-col items-start overflow-hidden'>
          <span>{buildingName}</span>
          <span className='text-sm truncate w-full text-start'>{address}</span>
        </span>
      </button>
    </li>
  );
};
