import * as Cesium from 'cesium';
import { useEffect } from 'react';
import {
  utilsClearCesiumLog,
  utilsRemoteDepthTestAgainstTerrain,
  utilsRemoteZoomDistance,
} from '../02_entities';
import type { CustomImageryLayer, useCesiumInitProps } from '../..';

type Props = {
  seoulCityHall: {
    lon: number;
    lat: number;
  };
  containerRef: React.RefObject<HTMLDivElement | null>;
  addImageryLayers: useCesiumInitProps['addImageryLayers'];
  setViewer: React.Dispatch<React.SetStateAction<Cesium.Viewer | null>>;
};

export const useEffectCesiumViewer = ({
  seoulCityHall,
  containerRef,
  addImageryLayers,
  setViewer,
}: Props): void => {
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

            const layer: CustomImageryLayer = new Cesium.ImageryLayer(provider);
            layer.name = type;
            viewer.imageryLayers.add(layer);
            if (!isDefault) layer.show = false;
          });
        }
      }, 1000);

      utilsClearCesiumLog({ container });
      utilsRemoteDepthTestAgainstTerrain({ viewer });
      utilsRemoteZoomDistance({ viewer });

      viewer.scene.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(
          seoulCityHall.lon,
          seoulCityHall.lat - 0.004,
          500
        ), // 중심 위치, 고도(m 단위)
        orientation: {
          heading: Cesium.Math.toRadians(0.0),
          pitch: Cesium.Math.toRadians(-40.0), // 카메라 조절  -90 ~ 0 (남에서 북쪽 보기)
          roll: 0.0,
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
