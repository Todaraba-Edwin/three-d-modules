import type * as Ty from '../05_shared/types';
import { utilsVworldUrl } from './utilsVworldUrl';

export const utilsImageryLayersAddIsDefault = ({
  arr,
  apiKey,
}: Ty.utilsImageryLayersAddIsDefaultProps): Ty.utilsImageryLayersAddIsDefaultReturn => {
  return arr.map((list: Ty.vWorldMapInfoArrType, idx: number) => {
    const isFirst = idx === 0;
    return {
      ...list,
      url: utilsVworldUrl({ type: list.type as Ty.vWorldTileMapType, apiKey }),
      isDefault: isFirst,
    };
  });
};
