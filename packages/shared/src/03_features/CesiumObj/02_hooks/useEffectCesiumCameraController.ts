import * as Cesium from 'cesium';
import { useEffect, useRef } from 'react';

type Props = {
  viewer: Cesium.Viewer | null;
};

export const useEffectCesiumCameraController = ({ viewer }: Props): void => {
  const lastMousePosition = useRef<Cesium.Cartesian2 | null>(null);
  const isRightActive = useRef<boolean>(false);
  const EPSILON = Cesium.Math.toRadians(0.1);

  useEffect(() => {
    if (!viewer) return;

    const controller = viewer.scene.screenSpaceCameraController;

    controller.enableTranslate = true;
    controller.enableZoom = true;
    controller.zoomEventTypes = [
      Cesium.CameraEventType.WHEEL,
      Cesium.CameraEventType.PINCH,
    ];

    controller.enableLook = true;
    controller.lookEventTypes = [Cesium.CameraEventType.RIGHT_DRAG];

    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

    // 🛑 우클릭 종료
    handler.setInputAction(() => {
      isRightActive.current = false;
      lastMousePosition.current = null;
      viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
      console.log('🛑 회전 종료');
    }, Cesium.ScreenSpaceEventType.RIGHT_UP);

    // 🚪 캔버스 이탈 시 종료
    viewer.scene.canvas.addEventListener('mouseleave', () => {
      isRightActive.current = false;
      lastMousePosition.current = null;
      viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
      console.log('🚪 캔버스 밖으로 나감: 회전 종료');
    });

    return () => {
      handler.destroy();
    };
  }, [viewer]);

  // 📌 roll 고정
  useEffect(() => {
    if (!viewer) return;
    const camera = viewer.scene.camera;

    const lockRoll = () => {
      if (Math.abs(camera.roll) > EPSILON) {
        camera.setView({
          destination: camera.positionWC,
          orientation: {
            heading: camera.heading,
            pitch: camera.pitch,
            roll: 0.0,
          },
        });
      }
    };

    viewer.scene.postUpdate.addEventListener(lockRoll);
    return () => {
      viewer.scene.postUpdate.removeEventListener(lockRoll);
    };
  }, [viewer, EPSILON]);
};
