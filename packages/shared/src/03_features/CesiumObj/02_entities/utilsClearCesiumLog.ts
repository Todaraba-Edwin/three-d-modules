import { CSEIUM_CLASS } from '../03_shared';
import type { containerProps } from '../03_shared/types';
import { utilsSetStyle } from './utilsSetStyle';

export const utilsClearCesiumLog = ({ container }: containerProps) => {
  const creditWrapper = container.querySelector(CSEIUM_CLASS.CREDITS);
  const isCesiumLog = creditWrapper instanceof HTMLElement;
  if (!isCesiumLog) return;

  utilsSetStyle({
    styleMap: { display: 'none' },
    container: creditWrapper,
  });
  return;
};
