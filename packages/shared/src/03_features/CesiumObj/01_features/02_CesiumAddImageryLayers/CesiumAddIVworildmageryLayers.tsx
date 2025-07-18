import * as Cesium from 'cesium';
import type { ReactNode } from 'react';
import {
  useCesiumAddVworldLayers,
  type SelectType,
  type utilsaddImageryLayersAddIsDefaultType,
} from '../..';

type Props = {
  apiKey: string;
  viewerRef: Cesium.Viewer | null;
  addImageryLayers: utilsaddImageryLayersAddIsDefaultType[];
  vWorldMapArrByType: Record<string, string[]>;
};

export const CesiumAddIVworildmageryLayers = ({
  apiKey,
  viewerRef,
  vWorldMapArrByType,
  addImageryLayers,
}: Props): ReactNode => {
  const { selectMap, utilsSetSelectMap } = useCesiumAddVworldLayers({
    apiKey,
    addImageryLayers,
    viewerRef,
    vWorldMapArrByType,
  });

  return (
    <div
      style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        zIndex: 99,
        backgroundColor: 'white',
      }}
    >
      <select
        style={{ width: '100px' }}
        value={selectMap}
        onChange={e => {
          const type = e.target.value as SelectType;
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
