import type { utilsSetStyleProps } from "../03_shared/types";

export const utilsSetStyle = ({ styleMap, container }: utilsSetStyleProps) => {
  Object.entries(styleMap).forEach(([key, value]) => {
    container.style.setProperty(key, value);
  });
  return;
};
