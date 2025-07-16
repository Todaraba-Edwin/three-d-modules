import { CSEIUM_CLASS } from '../03_shared';
import type { containerProps, ControlToolboxProps } from '../03_shared/types';
import { utilsSetStyle } from './utilsSetStyle';

export const enum ControlToolboxType {
  SEARCH_FULLSCREEN = 'SEARCH_FULLSCREEN',
}

export const utilsControlToolbox = ({
  type,
  container,
}: ControlToolboxProps) => {
  switch (type) {
    case ControlToolboxType.SEARCH_FULLSCREEN:
      utilsHandleSearchAndFullscreen({ container });
      break;
    default:
      break;
  }
};

function utilsHandleSearchAndFullscreen({ container }: containerProps) {
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
