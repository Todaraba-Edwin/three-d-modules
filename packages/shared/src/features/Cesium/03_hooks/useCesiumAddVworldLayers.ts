import { useEffect, useState } from 'react';
import type * as Ty from '../05_shared/types';

export const useCesiumAddVworldLayers = ({
  addImageryLayers,
  viewerRef,
  vWorldMapArrByType,
}: Ty.useCesiumAddVworldLayersProps): Ty.useCesiumAddVworldLayersReturn => {
  const [selectMap, setSelectMap] = useState<Ty.vWorldTileMapType>(
    () => addImageryLayers[0].type as Ty.vWorldTileMapType
  );

  useEffect(() => {
    if (!viewerRef) return;

    const layers = viewerRef.imageryLayers;

    const allLayers: Ty.CustomImageryLayer[] = [];
    for (let i = 0; i < layers.length; i++) {
      allLayers.push(layers.get(i));
    }
    allLayers.map(layer => {
      const getLayer = layer.name;
      if (typeof getLayer === 'undefined') return;
      const isTargetLayer = vWorldMapArrByType[selectMap].includes(getLayer);
      layer.show = isTargetLayer ? true : false;
    });
  }, [selectMap, viewerRef, vWorldMapArrByType]);

  const utilsSetSelectMap = ({ type }: { type: Ty.vWorldTileMapType }) => {
    setSelectMap(type);
    return;
  };

  return {
    selectMap,
    utilsSetSelectMap,
  };
};
