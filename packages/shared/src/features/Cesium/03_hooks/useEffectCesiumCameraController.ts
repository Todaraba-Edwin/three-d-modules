import * as Cesium from 'cesium';
import { useEffect } from 'react';
import type * as Ty from '../05_shared/types';

export const useEffectCesiumCameraController = ({
  viewer,
}: Ty.ViewerProps): void => {
  useEffect(() => {
    if (!viewer) return;
    setTimeout(() => {
      const controller = viewer.scene.screenSpaceCameraController;

      /*
      Default : zoomEventTypes : 1,3,4 */

      controller.zoomEventTypes = [
        Cesium.CameraEventType.WHEEL, // 3
        Cesium.CameraEventType.PINCH, // 4
      ];
      controller.enableZoom = true;

      const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

      const setInputActions = [
        Cesium.ScreenSpaceEventType.RIGHT_DOWN,
        // Cesium.ScreenSpaceEventType.MIDDLE_DOWN,
        Cesium.ScreenSpaceEventType.PINCH_START,
      ];

      setInputActions.forEach((ScreenSpaceEventType: number) => {
        handler.setInputAction(() => {
          /*
          Default : tiltEventTypes : 2,4 */

          controller.tiltEventTypes = [
            Cesium.CameraEventType.RIGHT_DRAG, // 1
            // Cesium.CameraEventType.MIDDLE_DRAG, // 2
            Cesium.CameraEventType.PINCH, // 4
          ];
          controller.enableTilt = true;
          controller.enableTranslate = true;
        }, ScreenSpaceEventType);
      });

      viewer.scene.canvas.addEventListener('mouseleave', () => {
        controller.enableTranslate = false;
        controller.enableTilt = false;
      });
      return () => {
        handler.destroy();
      };
    });
  }, [viewer]);
};
