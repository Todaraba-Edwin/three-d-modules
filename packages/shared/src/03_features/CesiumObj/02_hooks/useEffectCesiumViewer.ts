import * as Cesium from 'cesium';
import { useEffect } from 'react';
import {
  utilsClearCesiumLog,
  utilsRemoteDepthTestAgainstTerrain,
  utilsRemoteZoomDistance,
} from '../02_entities';
import type { CustomImageryLayer, useCesiumInitProps } from '../..';

type Props = {
  containerRef: React.RefObject<HTMLDivElement | null>;
  addImageryLayers: useCesiumInitProps['addImageryLayers'];
  setViewer: React.Dispatch<React.SetStateAction<Cesium.Viewer | null>>;
};

export const useEffectCesiumViewer = ({
  containerRef,
  addImageryLayers,
  setViewer,
}: Props): void => {
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

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
    });

    setViewer(viewer);

    const layers = viewer.imageryLayers;
    for (let i = layers.length - 1; i >= 1; i--) {
      layers.remove(layers.get(i));
    }

    setTimeout(() => {
      if (addImageryLayers?.length) {
        addImageryLayers.map(({ type, url, isDefault }) => {
          const provider = new Cesium.UrlTemplateImageryProvider({ url });
          provider.errorEvent.addEventListener(tileProviderError => {
            tileProviderError.retry = false; // 콘솔에 출력되는 디폴트 에러 무시
          });

          const layer: CustomImageryLayer = new Cesium.ImageryLayer(provider);
          layer.name = type as string;
          viewer.imageryLayers.add(layer);
          if (!isDefault) layer.show = false;
        });
      }
    }, 1000);

    utilsClearCesiumLog({ container });
    utilsRemoteDepthTestAgainstTerrain({ viewer });
    utilsRemoteZoomDistance({ viewer });

    return () => {
      if (viewer) {
        viewer.destroy();
        setViewer(null);
      }
    };
    // eslint-disable-next-line
  }, []);
  return;
};
