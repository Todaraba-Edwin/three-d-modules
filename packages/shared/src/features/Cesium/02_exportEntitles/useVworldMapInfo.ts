//✅ 01. vWorld 를 위한 상수 설정

import { utilImageryLayersAddIsDefault } from '../04_utils';

import type * as Ty from '../05_shared/types';

const vWorldMapArrByType = {
  ['Base']: ['Base'],
  ['Satellite']: ['Satellite'],
  ['Hybrid']: ['Satellite', 'Hybrid'],
  ['midnight']: ['midnight'],
};

const vWorldMapInfoArr: Ty.vWorldMapInfoArrType[] = [
  {
    type: 'Satellite',
    typeName: '위성지도',
  },
  {
    type: 'Hybrid',
    typeName: '하이브리드',
  },
  // {
  //   type: 'Base',
  //   typeName: '기본지도',
  // },
  // {
  //   type: 'midnight',
  //   typeName: '미드나잇모드',
  // },
];

export const useVworldMapInfo = ({
  apiKey,
}: {
  apiKey: string;
}): Ty.usevWorldMapInfoReturn => {
  if (!apiKey) {
    console.error('vWorld 지도추가를 위해서는 apiKey가 필수입니다.');
  }

  return {
    addImageryLayers: utilImageryLayersAddIsDefault({
      arr: vWorldMapInfoArr,
      ...(apiKey && { apiKey }),
    }),
    vWorldMapArrByType: vWorldMapArrByType,
  };
};
