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
  // 함체 및 CCTV 리스트
  {
    name: 'EnClosure1_1',
    type: 'Floor1',
    url: '/imgs/enclosure.glb',
    isError: true,
    positions: {
      lat: 37.56544416097736,
      lon: 126.98049775505184,
      height: 6.2,
      heading: 66,
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
    name: 'CCTV1_1',
    type: 'Floor1',
    url: '/imgs/cctv.glb',
    isError: true,
    positions: {
      lat: 37.566053659014095,
      lon: 126.98010462806941,
      height: 10,
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
    name: 'CCTV1_2',
    type: 'Floor1',
    url: '/imgs/cctv.glb',
    isError: true,
    positions: {
      lat: 37.565974571543656,
      lon: 126.98008814105461,
      height: 10,
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
    name: 'CCTV1_3',
    type: 'Floor1',
    url: '/imgs/cctv.glb',
    isError: true,
    positions: {
      lat: 37.565890080925726,
      lon: 126.9800796878212,
      height: 10,
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
    name: 'CCTV1_4',
    type: 'Floor1',
    url: '/imgs/cctv.glb',
    isError: true,
    positions: {
      lat: 37.56574396977437,
      lon: 126.98009730853066,
      height: 10,
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
    name: 'EnClosure2_1',
    type: 'Floor2',
    url: '/imgs/enclosure.glb',
    isError: true,
    positions: {
      lat: 37.56544416097736,
      lon: 126.98049775505184,
      height: 14.3,
      heading: 66,
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
    name: 'CCTV2_1',
    type: 'Floor2',
    url: '/imgs/cctv.glb',
    isError: true,
    positions: {
      lat: 37.56620406757204,
      lon: 126.98015218629105,
      height: 18.2,
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
    name: 'CCTV2_2',
    type: 'Floor2',
    url: '/imgs/cctv.glb',
    isError: true,
    positions: {
      lat: 37.56604131370697,
      lon: 126.98009912274684,
      height: 18.2,
      heading: 0,
    },
    get cameraPosition(): cameraPositionType {
      return {
        lon: this.positions.lon,
        lat:
          this.positions.lat -
          utilsGetDegreeFromMeter({ type: 'lat', meter: 160 }),
        height: 18.2,
        heading: 0,
      };
    },
  },
  {
    name: 'CCTV2_3',
    type: 'Floor2',
    url: '/imgs/cctv.glb',
    isError: true,
    positions: {
      lat: 37.565876291329985,
      lon: 126.98008538485904,
      height: 18.2,
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
    name: 'CCTV2_4',
    type: 'Floor2',
    url: '/imgs/cctv.glb',
    isError: true,
    positions: {
      lat: 37.56573494346668,
      lon: 126.9801168271253,

      height: 18.2,
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

// long 서 +, 동 -
// late - 남, + 북
// heading 높아지면 시계방향

const startCord = {
  lat: 37.56544416097736,
  lon: 126.98049775505184,
};
export const LineList = [
  {
    connection_IN: 'A시설물',
    connection_OUT: 'B시설물',
    totalDistance: 0,
    coordinates: [
      {
        type: 'horizontal',
        index: 0,
        lat: startCord.lat,
        lon: startCord.lon,
        height: 5,
        distance: 0,
      },
      {
        type: 'vertical',
        index: 1,
        lat: startCord.lat,
        lon: startCord.lon,
        height: 5,
        length: 5,
        distance: 0,
      },
      {
        type: 'horizontal',
        index: 2,
        lat: 37.565798792874375,
        lon: 126.98029629355457,
        height: 10,
        distance: 0,
      },
    ],
  },
];

export const LineList2 = [
  {
    connection_IN: 'A시설물',
    connection_OUT: 'B시설물',
    totalDistance: 0,
    coordinates: [
      {
        type: 'horizontal',
        index: 0,
        lat: 37.565798792874375,
        lon: 126.98029629355457,
        height: 10,
        distance: 0,
      },
      {
        type: 'horizontal',
        index: 1,
        lat: 37.56604280824939,
        lon: 126.98015962508765,
        height: 10,
        distance: 0,
      },
      {
        type: 'horizontal',
        index: 2,
        lat: 37.566053659014095,
        lon: 126.98010462806941,
        height: 10,
        distance: 0,
      },
    ],
  },
];

export const LineList3 = [
  {
    connection_IN: 'A시설물',
    connection_OUT: 'B시설물',
    totalDistance: 0,
    coordinates: [
      {
        type: 'horizontal',
        index: 0,
        lat: 37.565798792874375,
        lon: 126.98029629355457,
        height: 10,
        distance: 0,
      },
      {
        type: 'horizontal',
        index: 1,
        lat: 37.565965661041076,
        lon: 126.98014069031586,
        height: 10,
        distance: 0,
      },
      {
        type: 'horizontal',
        index: 2,
        lat: 37.565974571543656,
        lon: 126.98008814105461,
        height: 10,
        distance: 0,
      },
    ],
  },
];

export const LineList4 = [
  {
    connection_IN: 'A시설물',
    connection_OUT: 'B시설물',
    totalDistance: 0,
    coordinates: [
      {
        type: 'horizontal',
        index: 0,
        lat: 37.565798792874375,
        lon: 126.98029629355457,
        height: 10,
        distance: 0,
      },
      {
        type: 'horizontal',
        index: 1,
        lat: 37.56588936899734,
        lon: 126.98014286190538,
        height: 10,
        distance: 0,
      },
      {
        type: 'horizontal',
        index: 2,
        lat: 37.565890080925726,
        lon: 126.9800796878212,
        height: 10,
        distance: 0,
      },
    ],
  },
];

export const LineList5 = [
  {
    connection_IN: 'A시설물',
    connection_OUT: 'B시설물',
    totalDistance: 0,
    coordinates: [
      {
        type: 'horizontal',
        index: 0,
        lat: 37.565798792874375,
        lon: 126.98029629355457,
        height: 10,
        distance: 0,
      },
      {
        type: 'horizontal',
        index: 1,
        lat: 37.56575614268759,
        lon: 126.98016233966631,
        height: 10,
        distance: 0,
      },
      {
        type: 'horizontal',
        index: 2,
        lat: 37.56574396977437,
        lon: 126.98009730853066,
        height: 10,
        distance: 0,
      },
    ],
  },
];
