import * as Cesium from 'cesium';
import { utilsAdSphere, utilsCreatePerpendicularLine } from '../04_utils';

export const utilsAddPerpendicularLine = ({
  viewerRef,
  lineList,
}: {
  viewerRef: Cesium.Viewer | null;
  lineList?: {
    lon: number;
    lat: number;
    height: number;
    length: number;
    isTopConnect?: boolean;
    isBottomConnect?: boolean;
    lineWeight?: number;
  }[];
}): void => {
  if (!viewerRef) return;
  if (!lineList?.length) return;

  lineList.forEach(
    ({
      lon,
      lat,
      height,
      length,
      lineWeight = 0.3,
      isTopConnect,
      isBottomConnect,
    }) => {
      utilsCreatePerpendicularLine({
        viewerRef,
        list: { lon, lat, height, lineWeight, length },
      });

      if (isTopConnect)
        utilsAdSphere({
          viewerRef,
          type: 'isTopConnect',
          list: { lon, lat, height, lineWeight, length },
        });
      if (isBottomConnect)
        utilsAdSphere({
          viewerRef,
          type: 'isBottomConnect',
          list: { lon, lat, height, lineWeight, length },
        });
    }
  );

  return;
};
