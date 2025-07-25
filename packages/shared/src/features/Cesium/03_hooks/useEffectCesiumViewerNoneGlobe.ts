import * as Cesium from 'cesium';
import { useEffect } from 'react';
import * as Util from '../04_utils';
import type * as Ty from '../05_shared/types';

const EPSILON = Cesium.Math.toRadians(0.1);
export const useEffectCesiumViewerNoneGlobe = ({
  containerRef,
  setViewer,
  coordinate,
  initCameraHeight = 80,
}: Ty.useEffectCesiumViewerProps): void => {
  useEffect(() => {
    if (!containerRef.current) return;
    if (!setViewer) return;
    if (!coordinate.lat || !coordinate.lon) return;

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
    viewer.scene.skyAtmosphere.show = false; // 대기권 제거
    viewer.scene.backgroundColor = Cesium.Color.TRANSPARENT;
    setViewer(viewer);

    Util.utilsClearCesiumLog({ container }); // CesiumLog 제거
    Util.utilsRemoteZoomDistance({ viewer, isBuildingMode: true }); // 카메라 영역제한 설정

    // 2️⃣ 초기 카메라 이동
    const position = Util.utilsSetInitCameraPosition({
      coordinate,
      initCameraHeight,
    });

    viewer.camera.setView({
      destination: position,
      orientation: {
        heading: Cesium.Math.toRadians(0),
        pitch: Cesium.Math.toRadians(-25),
        roll: 0.0,
      },
    });

    viewer.scene.postUpdate.addEventListener(() => {
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
      viewer.destroy();
      setViewer(null);
    };
  }, [containerRef, setViewer, coordinate.lat, coordinate.lon]);
  return;
};
