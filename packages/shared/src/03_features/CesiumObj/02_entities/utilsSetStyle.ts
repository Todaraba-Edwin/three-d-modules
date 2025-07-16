export const utilsSetStyle = ({ styleMap, container }: utilsSetStyleProps) => {
  Object.entries(styleMap).forEach(([key, value]) => {
    container.style.setProperty(key, value);
  });
  return;
};
