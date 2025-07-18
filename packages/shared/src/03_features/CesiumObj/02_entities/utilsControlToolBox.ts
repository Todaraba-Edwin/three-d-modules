import type * as Ts from '../03_shared/types';

export const enum ControlToolboxType {
  // eslint-disable-next-line
  SEARCH_FULLSCREEN = 'SEARCH_FULLSCREEN',
}

export const CSEIUM_CLASS = {
  TOOLBAR: '.cesium-viewer-toolbar',
  FULL_SCREEN: '.cesium-viewer-fullscreenContainer',
} as const;

/**
 * Controls the visual appearance of Cesium toolbox UI elements based on a specified type.
 *
 * @param {Ts.ControlToolboxProps} params - Object containing the toolbox control type and Cesium container.
 * @param {ControlToolboxType} params.type - The control type to apply (e.g., SEARCH_FULLSCREEN).
 * @param {HTMLElement} params.container - The root Cesium viewer container element.
 * @returns {void}
 */
export const utilsControlToolbox = ({
  type,
  container,
}: Ts.ControlToolboxProps): void => {
  switch (type) {
    case ControlToolboxType.SEARCH_FULLSCREEN:
      utilsHandleSearchAndFullscreen({ container });
      break;
    default:
      break;
  }
};

// utils Funcions // ================================================================================

/**
 * Applies a map of CSS styles to the given container element.
 *
 * @param {Ts.utilsSetStyleProps} params - Parameters for setting styles.
 * @param {Record<string, string>} params.styleMap - A key-value map of CSS property names to values.
 * @param {HTMLElement} params.container - The target HTML element.
 * @returns {void}
 */
function utilsSetStyle({ styleMap, container }: Ts.utilsSetStyleProps): void {
  Object.entries(styleMap).forEach(([key, value]) => {
    container.style.setProperty(key, value);
  });
}

/**
 * Adjusts the styles for the Cesium search bar and fullscreen button.
 *
 * @param {Ts.containerProps} params - Object containing the Cesium container.
 * @param {HTMLElement} params.container - The Cesium viewer container.
 * @returns {void}
 */
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
