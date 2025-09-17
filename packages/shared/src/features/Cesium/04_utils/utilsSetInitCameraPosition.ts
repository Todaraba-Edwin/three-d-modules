import * as Cesium from 'cesium';
import type {
  utilsSetInitCameraProps,
  utilsSetInitCameraReturn,
} from '../05_shared/types';

export const utilsSetInitCameraPosition = ({
  coordinate,
  initCameraHeight,
}: utilsSetInitCameraProps): utilsSetInitCameraReturn => {
  return Cesium.Cartesian3.fromDegrees(
    coordinate.lon,
    coordinate.lat,
    initCameraHeight
  );
};
