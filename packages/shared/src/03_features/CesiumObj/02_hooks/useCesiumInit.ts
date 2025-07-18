import * as Cesium from 'cesium';
import { useEffect, useRef, useState } from 'react';
import { utilsClearCesiumLog } from '../02_entities';

const seoulCityHall = {
  lon: 126.9784,
  lat: 37.5667,
};
Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(
  seoulCityHall.lon - 0.01, // 서쪽
  seoulCityHall.lat - 0.01, // 남쪽
  seoulCityHall.lon + 0.01, // 동쪽
  seoulCityHall.lat + 0.01 // 북쪽
);
Cesium.Camera.DEFAULT_VIEW_FACTOR = 0;

type useCesiumInitReturn = {
  containerRef: React.RefObject<HTMLDivElement | null>;
  viewerRef: Cesium.Viewer | null;
};

export type useCesiumInitProps = {
  addImageryLayers?: {
    type: string;
    typeName: string;
    url: string;
    isDefault: boolean;
  }[];
};

export interface CustomImageryLayer extends Cesium.ImageryLayer {
  name?: string;
}

export const useCesiumInit = ({
  addImageryLayers,
}: useCesiumInitProps): useCesiumInitReturn => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewer, setViewer] = useState<Cesium.Viewer | null>(null);

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
    viewer.scene.globe.depthTestAgainstTerrain = true;

    return () => {
      if (viewer) {
        viewer.destroy();
        setViewer(null);
      }
    };
    // eslint-disable-next-line
  }, []);

  return {
    containerRef: containerRef,
    viewerRef: viewer,
  };
};
