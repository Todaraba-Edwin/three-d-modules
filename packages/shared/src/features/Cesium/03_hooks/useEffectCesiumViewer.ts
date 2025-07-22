import { useEffect } from 'react';
import * as Cesium from 'cesium';
import * as Util from '../04_utils';
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
      const terrainProvider = await Cesium.createWorldTerrainAsync();
      const viewer = new Cesium.Viewer(container, {
        terrainProvider, // ✅ 지형 고도 적용
        animation: false,
        timeline: false,
        baseLayerPicker: false,
        geocoder: false,
        sceneModePicker: false,
        homeButton: false,
        navigationHelpButton: false,
        infoBox: false,
        fullscreenButton: false,
      });

      setViewer(viewer);

      const layers = viewer.imageryLayers;
      for (let i = layers.length - 1; i >= 1; i--) {
        layers.remove(layers.get(i));
      }

      setTimeout(() => {
        if (addImageryLayers?.length) {
          addImageryLayers.forEach(({ type, url, isDefault }) => {
            const provider = new Cesium.UrlTemplateImageryProvider({ url });
            provider.errorEvent.addEventListener(tileProviderError => {
              tileProviderError.retry = false;
            });

            const layer: Ty.CustomImageryLayer = new Cesium.ImageryLayer(
              provider
            );
            layer.name = type;
            viewer.imageryLayers.add(layer);
            if (!isDefault) layer.show = false;
          });
        }
      }, 1000);

      Util.utilsClearCesiumLog({ container });
      Util.utilsRemoteDepthTestAgainstTerrain({ viewer });
      Util.utilsRemoteZoomDistance({ viewer });

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
