import type * as Ts from '../03_shared/types';

const CSEIUM_CLASS = {
  CREDITS: '.cesium-widget-credits',
} as const;

/**
 * Applies a map of CSS styles to the given container element.
 *
 * @param {Ts.utilsSetStyleProps} params
 * @param {Record<string, string>} params.styleMap - A key-value map of CSS property names to values.
 * @param {HTMLElement} params.container - The target HTML element.
 * @returns {void}
 */
const utilsSetStyle = ({
  styleMap,
  container,
}: Ts.utilsSetStyleProps): void => {
  Object.entries(styleMap).forEach(([key, value]) => {
    container.style.setProperty(key, value);
  });
};

/**
 * Hides the Cesium widget credits section within the given container.
 *
 * @param {Ts.containerProps} params
 * @param {HTMLElement} params.container -The target HTML element.
 * @returns {void}
 */
export const utilsClearCesiumLog = ({ container }: Ts.containerProps): void => {
  const creditWrapper = container.querySelector(CSEIUM_CLASS.CREDITS);
  if (!(creditWrapper instanceof HTMLElement)) return;

  utilsSetStyle({
    styleMap: { display: 'none' },
    container: creditWrapper,
  });
};
