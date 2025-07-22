import { utilsSetStyle } from './utilsSetStyle';
import type * as Ty from '../05_shared/types';

const CSEIUM_CLASS = {
  CREDITS: '.cesium-widget-credits',
} as const;

export const utilsClearCesiumLog = ({ container }: Ty.containerProps): void => {
  const creditWrapper = container.querySelector(CSEIUM_CLASS.CREDITS);
  if (!(creditWrapper instanceof HTMLElement)) return;

  utilsSetStyle({
    styleMap: { display: 'none' },
    container: creditWrapper,
  });
};
