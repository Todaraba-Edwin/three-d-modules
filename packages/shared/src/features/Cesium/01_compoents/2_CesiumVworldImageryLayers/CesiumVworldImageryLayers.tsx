import type { ReactNode } from 'react';
import { useCesiumAddVworldLayers } from '../../03_hooks';
import type * as Ty from '../../05_shared/types';

export const CesiumVworldImageryLayers = ({
  viewerRef,
  vWorldMapArrByType,
  addImageryLayers,
}: Ty.CesiumVworldImageryLayersProps): ReactNode => {
  const { selectMap, utilsSetSelectMap } = useCesiumAddVworldLayers({
    addImageryLayers,
    viewerRef,
    vWorldMapArrByType,
  });

  return (
    <div
      style={{
        top: '10px',
        left: '10px',
      }}
      className='absolute z-[99]'
    >
      <select
        className='p-2'
        value={selectMap}
        onChange={e => {
          const type = e.target.value as Ty.vWorldTileMapType;
          utilsSetSelectMap({ type });
        }}
      >
        {addImageryLayers?.length &&
          addImageryLayers.map(({ type, typeName }) => {
            return (
              <option key={type} value={type}>
                {typeName}
              </option>
            );
          })}
      </select>
    </div>
  );
};
