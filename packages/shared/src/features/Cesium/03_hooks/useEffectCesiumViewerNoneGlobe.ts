import * as Cesium from 'cesium';
import { useEffect } from 'react';
import { utilsClearCesiumLog } from '../04_utils/utilsClearCesiumLog';
import { utilsRemoteZoomDistance } from '../04_utils/utilsRemoteZoomDistance';
import type * as Ty from '../05_shared/types';
import { utilsSetInitCameraPosition } from '../04_utils/utilsSetInitCameraPosition';

const EPSILON = Cesium.Math.toRadians(0.1);
export const useEffectCesiumViewerNoneGlobe = ({
  containerRef,
  setViewer,
  initCameraPosition,
}: Ty.useEffectCesiumViewerProps): void => {
  useEffect(() => {
    if (!containerRef.current) return;
    if (!setViewer) return;

    const container = containerRef.current;

    // 1️⃣ Cesium Viewer 생성 및 상태관리 //
    const viewer = new Cesium.Viewer(container, {
      animation: false,
      timeline: false,
      baseLayerPicker: false,
      geocoder: false,
      sceneModePicker: false,
      homeButton: false,
      navigationHelpButton: false,
      infoBox: false,
      fullscreenButton: false,
      contextOptions: {
        webgl: {
          alpha: true, // ✅ 배경투명화 활성화
        },
      },
    });
    viewer.scene.globe.show = false; // 지구 제거
    viewer.scene.skyBox.show = false; // 별자리 제거
    viewer.scene.sun.show = false; // 별자리 제거
    viewer.scene.moon.show = false; // 별자리 제거
    viewer.scene.skyAtmosphere.show = false; // 대기권 제거
    viewer.scene.backgroundColor = Cesium.Color.TRANSPARENT;
    setViewer(viewer);

    utilsClearCesiumLog({ container }); // CesiumLog 제거
    utilsRemoteZoomDistance({ viewer, isBuildingMode: true }); // 카메라 영역제한 설정

    if (initCameraPosition) {
      // 2️⃣ 초기 카메라 이동
      const position = utilsSetInitCameraPosition({
        coordinate: {
          lat: initCameraPosition.lat,
          lon: initCameraPosition.lon,
        },
        initCameraHeight: initCameraPosition.height,
      });

      // const position = Cesium.Cartesian3.fromDegrees(
      //   initCameraPosition.lat,
      //   37.56422506647503,
      //   0 // initCameraPosition.height
      // );

      viewer.camera.setView({
        destination: position,
        orientation: {
          heading: Cesium.Math.toRadians(initCameraPosition.heading),
          pitch: Cesium.Math.toRadians(initCameraPosition.pitch as number),
          roll: 0.0,
        },
      });
    }

    const postUpdateListener = viewer.scene.postUpdate.addEventListener(() => {
      if (Math.abs(viewer.camera.roll) > EPSILON) {
        viewer.camera.setView({
          destination: viewer.camera.positionWC,
          orientation: {
            heading: viewer.camera.heading,
            pitch: viewer.camera.pitch,
            roll: 0.0,
          },
        });
      }
    });

    return () => {
      postUpdateListener();
      if (!viewer.isDestroyed()) {
        viewer.destroy();
      }
      setViewer(null);
    };
    //eslint-disable-next-line
  }, [containerRef, setViewer]);

  return;
};
