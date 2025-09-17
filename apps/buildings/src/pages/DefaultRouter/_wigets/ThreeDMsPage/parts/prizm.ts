import type {
  cameraPositionType,
  positionsType,
} from '@monorepo/shared/features/Cesium/05_shared/types';
import * as Cesium from 'cesium';

export type GlbListType = {
  name: string;
  type: string;
  url: string;
  positions: positionsType;
  cameraPosition: cameraPositionType;
  isError: boolean;
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

export const initCameraPosition = {
  lat: 37.56422506647503, //37.56692,
  lon: 126.97693,
  height: 150,
  heading: 65,
  pitch: -25,
};

export const SelectedFloorWithType: Record<
  'origin' | 'protruding',
  Record<number, Record<string, number>>
> = {
  ['origin']: {
    0: {
      lat:
        initCameraPosition.lat +
        utilsGetDegreeFromMeter({
          type: 'lat',
          meter: 160,
        }),
      lon:
        initCameraPosition.lon +
        utilsGetDegreeFromMeter({
          type: 'lon',
          meter: 200,
          lat: initCameraPosition.lat,
        }),
      height: 300,
      heading: 100,
      pitch: -70,
    },
    1: {
      lat:
        initCameraPosition.lat +
        utilsGetDegreeFromMeter({
          type: 'lat',
          meter: 150,
        }),
      lon:
        initCameraPosition.lon +
        utilsGetDegreeFromMeter({
          type: 'lon',
          meter: 200 + 30,
          lat: initCameraPosition.lat,
        }),
      height: 220,
      heading: 100,
      pitch: -70,
    },
    2: {
      lat:
        initCameraPosition.lat +
        utilsGetDegreeFromMeter({
          type: 'lat',
          meter: 150 + 30,
        }),
      lon:
        initCameraPosition.lon +
        utilsGetDegreeFromMeter({
          type: 'lon',
          meter: 200 + 30,
          lat: initCameraPosition.lat,
        }),
      height: 240,
      heading: 100,
      pitch: -70,
    },
    3: {
      lat:
        initCameraPosition.lat +
        utilsGetDegreeFromMeter({
          type: 'lat',
          meter: 150 + 30,
        }),
      lon:
        initCameraPosition.lon +
        utilsGetDegreeFromMeter({
          type: 'lon',
          meter: 200 + 20,
          lat: initCameraPosition.lat,
        }),
      height: 260,
      heading: 100,
      pitch: -70,
    },
    4: {
      lat:
        initCameraPosition.lat +
        utilsGetDegreeFromMeter({
          type: 'lat',
          meter: 150 + 30,
        }),
      lon:
        initCameraPosition.lon +
        utilsGetDegreeFromMeter({
          type: 'lon',
          meter: 200 + 10,
          lat: initCameraPosition.lat,
        }),
      height: 280,
      heading: 100,
      pitch: -70,
    },
  },
  ['protruding']: {
    1: {
      lat:
        initCameraPosition.lat +
        utilsGetDegreeFromMeter({
          type: 'lat',
          meter: 60,
        }),
      lon:
        initCameraPosition.lon +
        utilsGetDegreeFromMeter({
          type: 'lon',
          meter: 180,
          lat: initCameraPosition.lat,
        }),
      height: 180,
      heading: 65,
      pitch: -50,
    },

    2: {
      lat:
        initCameraPosition.lat +
        utilsGetDegreeFromMeter({
          type: 'lat',
          meter: 60 + 25,
        }),
      lon:
        initCameraPosition.lon +
        utilsGetDegreeFromMeter({
          type: 'lon',
          meter: 180,
          lat: initCameraPosition.lat,
        }),
      height: 180 + 30,
      heading: 65,
      pitch: -50,
    },
    3: {
      lat:
        initCameraPosition.lat +
        utilsGetDegreeFromMeter({
          type: 'lat',
          meter: 60 + 35,
        }),
      lon:
        initCameraPosition.lon +
        utilsGetDegreeFromMeter({
          type: 'lon',
          meter: 180,
          lat: initCameraPosition.lat,
        }),
      height: 180 + 60,
      heading: 65,
      pitch: -50,
    },
    4: {
      lat:
        initCameraPosition.lat +
        utilsGetDegreeFromMeter({
          type: 'lat',
          meter: 60 + 35,
        }),
      lon:
        initCameraPosition.lon +
        utilsGetDegreeFromMeter({
          type: 'lon',
          meter: 180,
          lat: initCameraPosition.lat,
        }),
      height: 180 + 90,
      heading: 65,
      pitch: -50,
    },
  },
};

export const GLB_ModuleList: GlbListType[] = [
  {
    name: 'BottomSurface',
    type: 'BottomSurface',
    url: '/imgs/G1.glb',
    isError: false,
    positions: {
      lat: 37.5667,
      lon: 126.9784,
      height: 0,
      heading: 0,
    },
    get cameraPosition(): cameraPositionType {
      return {
        lon: this.positions.lon,
        lat:
          this.positions.lat -
          utilsGetDegreeFromMeter({ type: 'lat', meter: 160 }),
        height: 0, // 조금 위쪽
        heading: 0,
      };
    },
  },
  {
    name: 'Floor1',
    type: 'Floor1',
    url: '/imgs/F_01.glb',
    isError: false,
    positions: {
      lat: 37.56535253323751,
      lon: 126.98043995723785,
      height: undefined,
      heading: 0,
    },
    get cameraPosition(): cameraPositionType {
      return {
        lon: this.positions.lon,
        lat:
          this.positions.lat -
          utilsGetDegreeFromMeter({ type: 'lat', meter: 160 }),
        height: 0, // 조금 위쪽
        heading: 0,
      };
    },
  },
  {
    name: 'Floor2',
    type: 'Floor2',
    url: '/imgs/F_02.glb',
    isError: false,
    positions: {
      lat: 37.56535253323751,
      lon: 126.98043995723785,
      height: 0,
      heading: 0,
    },
    get cameraPosition(): cameraPositionType {
      return {
        lon: this.positions.lon,
        lat:
          this.positions.lat -
          utilsGetDegreeFromMeter({ type: 'lat', meter: 160 }),
        height: 0, // 조금 위쪽
        heading: 0,
      };
    },
  },
  {
    name: 'Floor3',
    type: 'Floor3',
    url: '/imgs/F_03.glb',
    isError: false,
    positions: {
      lat: 37.56535253323751,
      lon: 126.98043995723785,
      height: 0,
      heading: 0,
    },
    get cameraPosition(): cameraPositionType {
      return {
        lon: this.positions.lon,
        lat:
          this.positions.lat -
          utilsGetDegreeFromMeter({ type: 'lat', meter: 160 }),
        height: 0, // 조금 위쪽
        heading: 0,
      };
    },
  },
  {
    name: 'Floor4',
    type: 'Floor4',
    url: '/imgs/F_04.glb',
    isError: false,
    positions: {
      lat: 37.56535253323751,
      lon: 126.98043995723785,
      height: 0,
      heading: 0,
    },
    get cameraPosition(): cameraPositionType {
      return {
        lon: this.positions.lon,
        lat:
          this.positions.lat -
          utilsGetDegreeFromMeter({ type: 'lat', meter: 160 }),
        height: 0, // 조금 위쪽
        heading: 0,
      };
    },
  },
];
