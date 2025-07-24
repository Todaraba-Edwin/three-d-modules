import * as Cesium from 'cesium';
import type {
  CustomImageryLayer,
  useEffectCesiumViewerProps,
  ViewerProps,
} from '../05_shared/types';

export const utilsSetAddImageryLayers = ({
  viewer,
  addImageryLayers,
}: {
  viewer: ViewerProps['viewer'];
  addImageryLayers: useEffectCesiumViewerProps['addImageryLayers'];
}): void => {
  if (!viewer) return;
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
  return;
};
