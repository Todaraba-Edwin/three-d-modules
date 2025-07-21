//✅ 01. vWorld 를 위한 상수 설정
export type SelectType = 'Base' | 'Satellite' | 'Hybrid' | 'midnight';
type vWorldMapInfoArrType = {
  type: string;
  typeName: string;
};

export type utilsaddImageryLayersAddIsDefaultType = vWorldMapInfoArrType & {
  url: string;
  isDefault: boolean;
};

type vWorldMapArrByTypeRecord = Record<string, string[]>;

const vWorldUrl = 'https://api.vworld.kr/req/wmts/1.0.0';
export const vWorldMapArrByType = {
  ['Base']: ['Base'],
  ['Satellite']: ['Satellite'],
  ['Hybrid']: ['Satellite', 'Hybrid'],
  ['midnight']: ['midnight'],
};

const vWorldMapInfoArr: vWorldMapInfoArrType[] = [
  {
    type: 'Base',
    typeName: '기본지도',
  },
  {
    type: 'Satellite',
    typeName: '위성지도',
  },
  {
    type: 'Hybrid',
    typeName: '하이브리드',
  },
  {
    type: 'midnight',
    typeName: '미드나잇모드',
  },
];

export const useVworldMapInfo = ({
  apiKey,
}: {
  apiKey: string;
}): {
  addImageryLayers: utilsaddImageryLayersAddIsDefaultType[];
  vWorldMapArrByType: vWorldMapArrByTypeRecord;
} => {
  if (!apiKey) {
    console.error('vWorld 지도추가를 위해서는 apiKey가 필수입니다.');
  }

  const utilsVworldUrl = ({
    type,
    apiKey,
  }: {
    type: SelectType;
    apiKey?: string;
  }): string => {
    const isSatellite = type === 'Satellite';
    if (!apiKey) return '';
    return `${vWorldUrl}/${apiKey}/${type}/{z}/{y}/{x}${isSatellite ? '.jpeg' : '.png'}`;
  };

  const utilsaddImageryLayersAddIsDefault = ({
    arr,
    apiKey,
  }: {
    apiKey?: string;
    arr: vWorldMapInfoArrType[];
  }): utilsaddImageryLayersAddIsDefaultType[] => {
    return arr.map((list: vWorldMapInfoArrType, idx: number) => {
      const isFirst = idx === 0;
      return {
        ...list,
        url: utilsVworldUrl({ type: list.type as SelectType, apiKey }),
        isDefault: isFirst,
      };
    });
  };

  return {
    addImageryLayers: utilsaddImageryLayersAddIsDefault({
      arr: vWorldMapInfoArr,
      ...(apiKey && { apiKey }),
    }),
    vWorldMapArrByType,
  };
};
