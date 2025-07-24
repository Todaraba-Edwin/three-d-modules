import * as Cesium from 'cesium';
import type { GlbListType } from './types';

export const vWorldUrl = 'https://api.vworld.kr/req/wmts/1.0.0';

export const CesiumCoordinate = {
  lon: 126.9784,
  lat: 37.5667,
};

export const CesiumCameraControll = {
  minimumZoomDistance: 50,
  maximumZoomDistance: 80000,
  buildingMode: {
    minimumZoomDistance: 0,
    maximumZoomDistance: 800,
  },
};

// TODO: glbList 생성을 위한 임시함수, uilts에 존재함으로 API 연결시 삭제 필요
const utilsGetDegreeFromMeter = ({
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

export const glbList: GlbListType[] = [
  {
    name: '문화시설',
    url: '/model/testmodules.glb',
    positions: { lon: CesiumCoordinate.lon, lat: CesiumCoordinate.lat },
    cameraPosition: {
      lon: CesiumCoordinate.lon,
      lat:
        CesiumCoordinate.lat -
        utilsGetDegreeFromMeter({ type: 'lat', meter: 160 }),
      height: 80, // 조금 위쪽
      heading: 0,
    },
  },
  {
    name: '문화시설2',
    url: '/model/testmodules.glb',
    positions: {
      lon:
        CesiumCoordinate.lon +
        utilsGetDegreeFromMeter({
          type: 'lon',
          meter: 200,
          lat: CesiumCoordinate.lat,
        }),
      lat: CesiumCoordinate.lat,
      heading: 90,
    },
    cameraPosition: {
      lon:
        CesiumCoordinate.lon +
        utilsGetDegreeFromMeter({
          type: 'lon',
          meter: 60,
          lat: CesiumCoordinate.lat,
        }),
      lat:
        CesiumCoordinate.lat +
        utilsGetDegreeFromMeter({ type: 'lat', meter: 160 }),
      height: 80, // 조금 위쪽
      heading: 135,
    },
  },
  {
    name: '체육관',
    url: '/model/test2.glb',
    positions: {
      lon:
        CesiumCoordinate.lon +
        utilsGetDegreeFromMeter({
          type: 'lon',
          meter: 100 - 50, // Gis 가중치 50
          lat: CesiumCoordinate.lat,
        }),
      lat: CesiumCoordinate.lat,
      scale: 2.0,
    },
    cameraPosition: {
      lon:
        CesiumCoordinate.lon +
        utilsGetDegreeFromMeter({
          type: 'lon',
          meter: 0,
          lat: CesiumCoordinate.lat,
        }),
      lat:
        CesiumCoordinate.lat -
        utilsGetDegreeFromMeter({ type: 'lat', meter: 0 }),
      height: 80, // 조금 위쪽
      heading: 90,
    },
  },
];
