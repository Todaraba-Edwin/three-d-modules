import * as Cesium from 'cesium';
import { useEffect } from 'react';
import { utilsClearCesiumLog } from '../04_utils/utilsClearCesiumLog';
import { utilsImageryLayersInit } from '../04_utils/utilsImageryLayersInit';
import { utilsRemoteDepthTestAgainstTerrain } from '../04_utils/utilsRemoteDepthTestAgainstTerrain';
import { utilsRemoteZoomDistance } from '../04_utils/utilsRemoteZoomDistance';
import { utilsSetAddImageryLayers } from '../04_utils/utilsSetAddImageryLayers';
import type * as Ty from '../05_shared/types';

export const useEffectCesiumViewer = ({
  coordinate,
  containerRef,
  addImageryLayers,
  setViewer,
}: Ty.useEffectCesiumViewerProps): void => {
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    (async () => {
      // 1️⃣ Cesium Viewr 생성 및 상태관리 //
      const terrainProvider = await Cesium.createWorldTerrainAsync();
      const viewer = new Cesium.Viewer(container, {
        terrainProvider,
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
      utilsImageryLayersInit({ viewer });
      viewer.scene.skyBox.show = false; // 별자리 제거
      setViewer(viewer);

      utilsSetAddImageryLayers({
        viewer,
        addImageryLayers,
      });

      utilsClearCesiumLog({ container });
      utilsRemoteDepthTestAgainstTerrain({ viewer });
      utilsRemoteZoomDistance({ viewer });

      viewer.scene.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(
          coordinate.lon,
          coordinate.lat, // seoulCityHall.lat - 0.004,
          500
        ),
        orientation: {
          heading: Cesium.Math.toRadians(0.0), // 지도의 방향설정, 0.0 남->북, -90.0 동->서, 90.0 서->동
          pitch: Cesium.Math.toRadians(-40.0), // 지면(0)에서 위성고도(정수직,-90)
          roll: 0.0, // 카메라의 호버링으로 좌우틸드인데, 일반앱에서는 0이 고정 값
        },
      });

      return () => {
        viewer.destroy();
        setViewer(null);
      };
    })();
    // eslint-disable-next-line
  }, []);
  return;
};
