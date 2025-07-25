import * as Cesium from 'cesium';
import type {
  utilsSetInitCameraProps,
  utilsSetInitCameraReturn,
} from '../05_shared/types';
import { utilsGetDegreeFromMeter } from './utilsGetDegreeFromMeter';

export const utilsSetInitCameraPosition = ({
  coordinate,
  initCameraHeight,
}: utilsSetInitCameraProps): utilsSetInitCameraReturn => {
  return Cesium.Cartesian3.fromDegrees(
    coordinate.lon,
    coordinate.lat -
      utilsGetDegreeFromMeter({
        type: 'lat',
        meter: initCameraHeight * 2,
      }),
    initCameraHeight
  );
};
