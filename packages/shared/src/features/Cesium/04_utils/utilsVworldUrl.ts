import * as Const from '../05_shared/cesiumConst';
import type * as Ty from '../05_shared/types';

export const utilsVworldUrl = ({
  type,
  apiKey,
}: {
  type: Ty.vWorldTileMapType;
  apiKey?: string;
}): string => {
  const isSatellite = type === 'Satellite';
  if (!apiKey) return '';
  return `${Const.vWorldUrl}/${apiKey}/${type}/{z}/{y}/{x}${isSatellite ? '.jpeg' : '.png'}`;
};
