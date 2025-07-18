import { useEffect, useState } from 'react';
import * as Cesium from 'cesium';

import type {
  CustomImageryLayer,
  SelectType,
  utilsaddImageryLayersAddIsDefaultType,
} from '../..';

type useCesiumAddVworldLayersReturnType = {
  selectMap: string;
  // eslint-disable-next-line
  utilsSetSelectMap: ({ type }: { type: SelectType }) => void;
};

export const useCesiumAddVworldLayers = ({
  addImageryLayers,
  viewerRef,
  vWorldMapArrByType,
}: {
  apiKey: string;
  addImageryLayers: utilsaddImageryLayersAddIsDefaultType[];
  viewerRef: Cesium.Viewer | null;
  vWorldMapArrByType: Record<string, string[]>;
}): useCesiumAddVworldLayersReturnType => {
  const [selectMap, setSelectMap] = useState<SelectType>(
    () => addImageryLayers[0].type as SelectType
  );

  useEffect(() => {
    if (!viewerRef) return;

    const layers = viewerRef.imageryLayers;

    const allLayers: CustomImageryLayer[] = [];
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

  const utilsSetSelectMap = ({ type }: { type: SelectType }) => {
    setSelectMap(type);
    return;
  };

  return {
    selectMap,
    utilsSetSelectMap,
  };
};
