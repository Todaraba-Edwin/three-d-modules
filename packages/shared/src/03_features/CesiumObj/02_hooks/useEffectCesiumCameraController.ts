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

// import * as Cesium from 'cesium';
// import { useEffect, useRef } from 'react';

// type Props = {
//   viewer: Cesium.Viewer | null;
// };

// export const useEffectCesiumCameraController = ({ viewer }: Props): void => {
//   const lastMousePosition = useRef<Cesium.Cartesian2 | null>(null);
//   const isRightActive = useRef<boolean>(false);
//   const EPSILON = Cesium.Math.toRadians(0.1);

//   useEffect(() => {
//     if (!viewer) return;

//     const controller = viewer.scene.screenSpaceCameraController;

//     controller.enableTranslate = true;
//     controller.enableZoom = true;
//     controller.zoomEventTypes = [
//       Cesium.CameraEventType.WHEEL,
//       Cesium.CameraEventType.PINCH,
//     ];

//     controller.enableLook = false;

//     const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

//     // 🛑 우클릭 종료
//     handler.setInputAction(() => {
//       isRightActive.current = false;
//       lastMousePosition.current = null;
//       viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
//       console.log('🛑 회전 종료');
//     }, Cesium.ScreenSpaceEventType.RIGHT_UP);

//     // 🚪 캔버스 이탈 시 종료
//     viewer.scene.canvas.addEventListener('mouseleave', () => {
//       isRightActive.current = false;
//       lastMousePosition.current = null;
//       viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
//       console.log('🚪 캔버스 밖으로 나감: 회전 종료');
//     });

//     return () => {
//       handler.destroy();
//     };
//   }, [viewer]);

//   // 📌 roll 고정
//   useEffect(() => {
//     if (!viewer) return;
//     const camera = viewer.scene.camera;

//     const lockRoll = () => {
//       if (Math.abs(camera.roll) > EPSILON) {
//         camera.setView({
//           destination: camera.positionWC,
//           orientation: {
//             heading: camera.heading,
//             pitch: camera.pitch,
//             roll: 0.0,
//           },
//         });
//       }
//     };

//     viewer.scene.postUpdate.addEventListener(lockRoll);
//     return () => {
//       viewer.scene.postUpdate.removeEventListener(lockRoll);
//     };
//   }, [viewer, EPSILON]);
// };

// import * as Cesium from 'cesium';
// import { useEffect, useRef } from 'react';

// type Props = {
//   viewer: Cesium.Viewer | null;
// };

// export const useEffectCesiumCameraController = ({ viewer }: Props): void => {
//   const rotationCenter = useRef<Cesium.Cartesian3 | null>(null);
//   const lookOffsetRef = useRef<Cesium.HeadingPitchRange | null>(null);
//   const lastMousePosition = useRef<Cesium.Cartesian2 | null>(null);
//   const isRightActive = useRef<boolean>(false);
//   const rotateRate = 0.005;
//   const EPSILON = Cesium.Math.toRadians(0.1);

//   useEffect(() => {
//     if (!viewer) return;

//     const controller = viewer.scene.screenSpaceCameraController;

//     controller.enableTranslate = true;
//     controller.enableZoom = true;
//     controller.zoomEventTypes = [
//       Cesium.CameraEventType.WHEEL,
//       Cesium.CameraEventType.PINCH,
//       // Cesium.CameraEventType.RIGHT_DRAG
//     ];

//     controller.enableLook = false; // 직접 처리하므로 false로 설정

//     const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

//     // 🧲 회전 중심 설정
//     // handler.setInputAction((click: { position: Cesium.Cartesian2 }) => {
//     //   const picked = viewer.scene.pickPosition(click.position);
//     //   if (Cesium.defined(picked)) {
//     //     rotationCenter.current = picked;

//     //     const distance = Cesium.Cartesian3.distance(
//     //       viewer.camera.positionWC,
//     //       picked
//     //     );

//     //     // ✅ 현재 카메라 orientation을 기준으로 설정
//     //     lookOffsetRef.current = new Cesium.HeadingPitchRange(
//     //       viewer.camera.heading,
//     //       viewer.camera.pitch,
//     //       distance
//     //     );

//     //     viewer.camera.lookAt(picked, lookOffsetRef.current);
//     //     lastMousePosition.current = Cesium.Cartesian2.clone(
//     //       click.position,
//     //       new Cesium.Cartesian2()
//     //     );
//     //     isRightActive.current = true;

//     //     const carto = Cesium.Cartographic.fromCartesian(picked);
//     //     console.log('🌀 회전 중심 위치:', {
//     //       lon: Cesium.Math.toDegrees(carto.longitude),
//     //       lat: Cesium.Math.toDegrees(carto.latitude),
//     //       height: carto.height,
//     //     });
//     //   }
//     // }, Cesium.ScreenSpaceEventType.RIGHT_DOWN);

//     // 🎯 마우스 이동 시 회전
//     // handler.setInputAction((movement: { endPosition: Cesium.Cartesian2 }) => {
//     //   if (
//     //     !isRightActive.current ||
//     //     !lastMousePosition.current ||
//     //     !lookOffsetRef.current
//     //   )
//     //     return;

//     //   const deltaX = movement.endPosition.x - lastMousePosition.current.x;
//     //   const deltaY = movement.endPosition.y - lastMousePosition.current.y;

//     //   console.log('➡️ 마우스 이동량:', { deltaX, deltaY });

//     //   lookOffsetRef.current.heading -= deltaX * rotateRate;
//     //   lookOffsetRef.current.pitch -= deltaY * rotateRate;

//     //   // pitch 범위 제한 (-90도 ~ 0도)
//     //   lookOffsetRef.current.pitch = Cesium.Math.clamp(
//     //     lookOffsetRef.current.pitch,
//     //     Cesium.Math.toRadians(-90),
//     //     Cesium.Math.toRadians(0)
//     //   );

//     //   if (rotationCenter.current) {
//     //     viewer.camera.lookAt(rotationCenter.current, lookOffsetRef.current);
//     //   }

//     //   lastMousePosition.current = Cesium.Cartesian2.clone(
//     //     movement.endPosition,
//     //     new Cesium.Cartesian2()
//     //   );
//     // }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

//     // 🛑 우클릭 종료
//     handler.setInputAction(() => {
//       isRightActive.current = false;
//       lastMousePosition.current = null;
//       viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
//       console.log('🛑 회전 종료');
//     }, Cesium.ScreenSpaceEventType.RIGHT_UP);

//     // 🚪 캔버스 이탈 시 종료
//     viewer.scene.canvas.addEventListener('mouseleave', () => {
//       isRightActive.current = false;
//       lastMousePosition.current = null;
//       viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
//       console.log('🚪 캔버스 밖으로 나감: 회전 종료');
//     });

//     return () => {
//       handler.destroy();
//     };
//   }, [viewer]);

//   // 📌 roll 고정
//   useEffect(() => {
//     if (!viewer) return;
//     const camera = viewer.scene.camera;

//     const lockRoll = () => {
//       if (Math.abs(camera.roll) > EPSILON) {
//         camera.setView({
//           destination: camera.positionWC,
//           orientation: {
//             heading: camera.heading,
//             pitch: camera.pitch,
//             roll: 0.0,
//           },
//         });
//       }
//     };

//     viewer.scene.postUpdate.addEventListener(lockRoll);
//     return () => {
//       viewer.scene.postUpdate.removeEventListener(lockRoll);
//     };
//   }, [viewer, EPSILON]);
// };

// ====================================================================================================================================================================================

// import * as Cesium from 'cesium';
// import { useEffect, useRef } from 'react';

// type Props = {
//   viewer: Cesium.Viewer | null;
// };

// export const useEffectCesiumCamereContoroller = ({ viewer }: Props): void => {
//   const rotationCenter = useRef<Cesium.Cartesian3 | null>(null);
//   const lastMousePosition = useRef<Cesium.Cartesian2 | null>(null);
//   const isRightActive = useRef<boolean>(false);

//   useEffect(() => {
//     if (!viewer) return;

//     const controller = viewer.scene.screenSpaceCameraController;

//     const utilsEnableLook = ({ isAactive }: { isAactive: boolean }): void => {
//       isRightActive.current = isAactive;
//       controller.enableLook = isAactive;
//     };

//     controller.enableTranslate = true;
//     controller.enableZoom = true;
//     controller.zoomEventTypes = [
//       Cesium.CameraEventType.WHEEL,
//       Cesium.CameraEventType.PINCH,
//     ];

//     controller.enableLook = true;
//     controller.lookEventTypes = Cesium.CameraEventType.RIGHT_DRAG;

//     const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

//     // 우클릭 시작: 회전 중심 설정
//     handler.setInputAction((click: { position: Cesium.Cartesian2 }) => {
//       const position = viewer.scene.pickPosition(click.position);
//       utilsEnableLook({ isAactive: true });

//       if (Cesium.defined(position)) {
//         rotationCenter.current = position;
//         lastMousePosition.current = click.position;

//         // const cartographic = Cesium.Cartographic.fromCartesian(position);
//         // const lon = Cesium.Math.toDegrees(cartographic.longitude);
//         // const lat = Cesium.Math.toDegrees(cartographic.latitude);
//         // const height = cartographic.height;

//         // console.log('🌀 회전 중심 위치:', { lon, lat, height });
//       }
//     }, Cesium.ScreenSpaceEventType.RIGHT_DOWN);

//     // 마우스 이동 시 로그 출력
//     // handler.setInputAction((movement: { endPosition: Cesium.Cartesian2 }) => {
//     //   if (!isRightActive.current) return;

//     //   console.log('========================================================');

//     //   console.log('lastMousePosition.current', lastMousePosition.current);
//     //   console.log('movement', movement.endPosition);

//     //   // const deltaX = movement.endPosition.x - lastMousePosition.current.x;
//     //   // const deltaY = movement.endPosition.y - lastMousePosition.current.y;

//     //   // console.log('➡️ 마우스 이동량:', { deltaX, deltaY });

//     //   // 다음 이동을 위해 현재 위치를 저장
//     //   lastMousePosition.current = Cesium.Cartesian2.clone(movement.endPosition, new Cesium.Cartesian2());
//     // }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

//     handler.setInputAction((movement: { endPosition: Cesium.Cartesian2 }) => {
//       if (!isRightActive.current || !lastMousePosition.current) return;

//       const deltaX = movement.endPosition.x - lastMousePosition.current.x;
//       const deltaY = movement.endPosition.y - lastMousePosition.current.y;

//       console.log('➡️ 마우스 이동량:', { deltaX, deltaY });

//       // ✅ 깊은 복사로 새 객체 저장
//       lastMousePosition.current = Cesium.Cartesian2.clone(
//         movement.endPosition,
//         new Cesium.Cartesian2()
//       );
//     }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

//     // 우클릭 종료
//     handler.setInputAction(() => {
//       utilsEnableLook({ isAactive: false });
//       lastMousePosition.current = null;
//       rotationCenter.current = null;
//       console.log('🛑 회전 종료');
//     }, Cesium.ScreenSpaceEventType.RIGHT_UP);

//     // 마우스가 캔버스 밖으로 나가면 회전 종료
//     const canvas = viewer.scene.canvas;
//     canvas.addEventListener('mouseleave', () => {
//       utilsEnableLook({ isAactive: false });
//       lastMousePosition.current = null;
//       rotationCenter.current = null;
//       console.log('🚪 캔버스 밖으로 나감: 회전 종료');
//     });

//     return () => {
//       handler.destroy();
//       // canvas.removeEventListener('mouseleave', () => {});
//     };
//   }, [viewer]);

//   // 카메라 roll 보정
//   const EPSILON = Cesium.Math.toRadians(0.1);
//   useEffect(() => {
//     if (!viewer) return;

//     const camera = viewer.scene.camera;

//     const lockRoll = () => {
//       if (Math.abs(camera.roll) > EPSILON) {
//         camera.setView({
//           destination: camera.positionWC,
//           orientation: {
//             heading: camera.heading,
//             pitch: camera.pitch,
//             roll: 0.0,
//           },
//         });
//       }
//     };

//     viewer.scene.postUpdate.addEventListener(lockRoll);

//     return () => {
//       viewer.scene.postUpdate.removeEventListener(lockRoll);
//     };
//   }, [viewer, EPSILON]);

//   return;
// };
