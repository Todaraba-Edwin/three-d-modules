import { utilsAdSphere, utilsCreatePerpendicularLine } from '../04_utils';
import type { ViewerProps } from '../05_shared/types';

export const utilsAddVerticalLine = ({
  viewer,
  lineList,
}: {
  viewer: ViewerProps['viewer'];
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
  if (!viewer) return;
  if (!lineList?.length) return;

  lineList.forEach(
    ({
      lon,
      lat,
      height,
      length,
      lineWeight = 0.3,
      // isTopConnect,
      // isBottomConnect,
    }) => {
      utilsCreatePerpendicularLine({
        viewerRef: viewer,
        list: { lon, lat, height, lineWeight, length },
      });

      ['isTopConnect', 'isBottomConnect'].forEach(connectType => {
        utilsAdSphere({
          viewerRef: viewer,
          type: connectType as 'isTopConnect' | 'isBottomConnect',
          list: { lon, lat, height, lineWeight, length },
        });
      });
    }
  );

  return;
};
