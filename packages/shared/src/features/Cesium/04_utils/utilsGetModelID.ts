import type { utilsGetModelIDReturn } from '../05_shared/types';

export const utilsGetModelID = (props: string): utilsGetModelIDReturn => {
  return JSON.parse(props);
};
