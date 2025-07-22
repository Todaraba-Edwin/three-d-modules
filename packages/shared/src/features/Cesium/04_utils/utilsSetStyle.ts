import type * as Ty from '../05_shared/types';

export const utilsSetStyle = ({
  styleMap,
  container,
}: Ty.utilsSetStyleProps): void => {
  Object.entries(styleMap).forEach(([key, value]) => {
    container.style.setProperty(key, value);
  });
  return;
};
