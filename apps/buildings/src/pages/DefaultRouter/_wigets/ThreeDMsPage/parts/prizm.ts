import type {
  cameraPositionType,
  positionsType,
} from '@monorepo/shared/features/Cesium/05_shared/types';
import * as Cesium from 'cesium';

type GlbListType = {
  name: string;
  type: string;
  url: string;
  positions: positionsType;
  cameraPosition: cameraPositionType;
  isError: boolean;
};

export const initCameraPosition = {
  lat: 37.56692,
  lon: 126.97693,
  height: 150,
  heading: 65,
  pitch: -25,
};

export const GLB_ModuleLists = [
  {
    name: 'BottomSurface',
    cameraPosition: {
      lat: 37.5667,
      lon: 126.9784,
      height: -5,
      heading: 0,
    },
  },
  {
    name: 'Floor1',
    cameraPosition: {
      lat: 37.56535253323751,
      lon: 126.98043995723785,
      height: undefined,
      heading: 0,
    },
  },
  {
    name: 'Floor2',
    cameraPosition: {
      lat: 37.56535253323751,
      lon: 126.98043995723785,
      height: 0,
      heading: 0,
    },
  },
  {
    name: 'Floor3',
    cameraPosition: {
      lat: 37.56535253323751,
      lon: 126.98043995723785,
      height: 0,
      heading: 0,
    },
  },
  {
    name: 'Floor4',
    cameraPosition: {
      lat: 37.56535253323751,
      lon: 126.98043995723785,
      height: 0,
      heading: 0,
    },
  },
];

/// ==========================================================
export const CesiumCoordinate = {
  lon: 126.9784,
  lat: 37.5667,
};

export const utilsGetDegreeFromMeter = ({
  type,
  meter,
  lat,
}:
  | {
      type: 'lat';
      meter: number;
      lat?: number;
    }
  | {
      type: 'lon';
      meter: number;
      lat: number;
    }): number => {
  if (type === 'lat') {
    return meter / 111_320; // ✅ 위도는 고정값
  }

  const latRad = Cesium.Math.toRadians(lat);
  return meter / (111_320 * Math.cos(latRad)); // ✅ 경도는 cos(lat) 보정
};

export const buildingCoordinate = {
  lon: 126.98043995723785,
  lat: 37.56535253323751,
};

console.log('buildingCoordinate', buildingCoordinate);

export const CesiumCameraControl = {
  minimumZoomDistance: 50, // 지상 50 M
  maximumZoomDistance: 80000, // 지상 80 KM
  buildingMode: {
    minimumZoomDistance: 0, // 지상 0 M
    maximumZoomDistance: 1000, // 지상 1000 M
  },
};

export const prizmLists: GlbListType[] = [
  {
    name: 'G1',
    type: 'type1',
    url: '/imgs/G1.glb',
    positions: {
      lon: CesiumCoordinate.lon,
      lat: CesiumCoordinate.lat,
      height: -5,
    },
    cameraPosition: {
      lon: CesiumCoordinate.lon,
      lat:
        CesiumCoordinate.lat -
        utilsGetDegreeFromMeter({ type: 'lat', meter: 160 }),
      height: 0, // 조금 위쪽
      heading: 0,
    },
    isError: false,
  },
  {
    name: 'F1',
    type: 'type1',
    url: '/imgs/F_01.glb',
    isError: false,
    positions: {
      lon: buildingCoordinate.lon,
      lat: buildingCoordinate.lat,
      heading: 0,
    },
    cameraPosition: {
      lon: buildingCoordinate.lon,
      lat:
        buildingCoordinate.lat -
        utilsGetDegreeFromMeter({ type: 'lat', meter: 160 }),
      height: 0, // 조금 위쪽
      heading: 0,
    },
  },
  {
    name: 'F2',
    type: 'type1',
    url: '/imgs/F_02.glb',
    isError: false,
    positions: {
      lon: buildingCoordinate.lon,
      lat: buildingCoordinate.lat,
      height: 0,
    },
    cameraPosition: {
      lon: buildingCoordinate.lon,
      lat:
        buildingCoordinate.lat -
        utilsGetDegreeFromMeter({ type: 'lat', meter: 160 }),
      height: 0, // 조금 위쪽
      heading: 0,
    },
  },
  {
    name: 'F3',
    type: 'type1',
    url: '/imgs/F_03.glb',
    isError: false,
    positions: {
      lon: buildingCoordinate.lon,
      lat: buildingCoordinate.lat,
      height: 0,
    },
    cameraPosition: {
      lon: buildingCoordinate.lon,
      lat:
        buildingCoordinate.lat -
        utilsGetDegreeFromMeter({ type: 'lat', meter: 160 }),
      height: 0, // 조금 위쪽
      heading: 0,
    },
  },
  {
    name: 'F4',
    type: 'type1',
    url: '/imgs/F_04.glb',
    isError: false,
    positions: {
      lon: buildingCoordinate.lon,
      lat: buildingCoordinate.lat,
      height: 0,
    },
    cameraPosition: {
      lon: buildingCoordinate.lon,
      lat:
        buildingCoordinate.lat -
        utilsGetDegreeFromMeter({ type: 'lat', meter: 160 }),
      height: 0, // 조금 위쪽
      heading: 0,
    },
  },
];

prizmLists.forEach(list => {
  console.log(`
      name: ${list.name}
      cameraPosition: 
      - lat : ${list.positions.lat}
      - log : ${list.positions.lon}
      - height : ${list.positions.height}
      - heading : ${list.positions.heading}
    `);
});
