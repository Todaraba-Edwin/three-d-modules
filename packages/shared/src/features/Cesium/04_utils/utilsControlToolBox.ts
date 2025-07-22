import { utilsSetStyle } from './utilsSetStyle';
import type * as Ts from '../05_shared/types';

export const enum ControlToolboxType {
  // eslint-disable-next-line
  SEARCH_FULLSCREEN = 'SEARCH_FULLSCREEN',
}

export const CSEIUM_CLASS = {
  TOOLBAR: '.cesium-viewer-toolbar',
  FULL_SCREEN: '.cesium-viewer-fullscreenContainer',
} as const;

export const utilsControlToolbox = ({
  type,
  container,
}: Ts.utilsControlToolboxProps): void => {
  switch (type) {
    case ControlToolboxType.SEARCH_FULLSCREEN:
      utilsHandleSearchAndFullscreen({ container });
      break;
    default:
      break;
  }
};

function utilsHandleSearchAndFullscreen({
  container,
}: Ts.containerProps): void {
  const toolbar = container.querySelector(CSEIUM_CLASS.TOOLBAR);
  if (toolbar instanceof HTMLElement) {
    utilsSetStyle({
      styleMap: { right: '40px' },
      container: toolbar,
    });
  }

  const fullscreen = container.querySelector(CSEIUM_CLASS.FULL_SCREEN);
  if (fullscreen instanceof HTMLElement) {
    utilsSetStyle({
      styleMap: {
        transform: 'scale(1.1111)',
        transformOrigin: 'top right',
        top: '6px',
        right: '8px',
      },
      container: fullscreen,
    });
  }
}
