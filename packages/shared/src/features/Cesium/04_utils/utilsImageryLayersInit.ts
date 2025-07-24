import type { ViewerProps } from '../05_shared/types';

export const utilsImageryLayersInit = ({ viewer }: ViewerProps): void => {
  if (!viewer) return;
  const layers = viewer.imageryLayers;
  for (let i = layers.length - 1; i >= 1; i--) {
    layers.remove(layers.get(i));
  }
  return;
};
