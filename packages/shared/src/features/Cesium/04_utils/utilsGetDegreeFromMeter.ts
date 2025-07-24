import * as Cesium from 'cesium';

/**
 * 거리(m)를 위/경도 변화량(degree)으로 변환
 * type이 'lat'이면 위도 기준 (111.32 고정)
 * type이 'lon'이면 경도 기준 (위도에 따라 cos 보정)
 */
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
