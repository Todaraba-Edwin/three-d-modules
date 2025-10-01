import type { utilsSetModelIDProp } from '../05_shared/types';

export const utilsSetModelID = (props: utilsSetModelIDProp): string => {
  return JSON.stringify(props);
};
