import { utilsVworldUrl } from './utilsVworldUrl';
import type * as Ty from '../05_shared/types';

export const utilImageryLayersAddIsDefault = ({
  arr,
  apiKey,
}: Ty.utilImageryLayersAddIsDefaultProps): Ty.utilImageryLayersAddIsDefaultReturn => {
  return arr.map((list: Ty.vWorldMapInfoArrType, idx: number) => {
    const isFirst = idx === 0;
    return {
      ...list,
      url: utilsVworldUrl({ type: list.type as Ty.vWorldTileMapType, apiKey }),
      isDefault: isFirst,
    };
  });
};
