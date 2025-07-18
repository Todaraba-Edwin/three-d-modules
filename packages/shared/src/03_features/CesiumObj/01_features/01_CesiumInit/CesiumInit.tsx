import * as Cesium from 'cesium';
import { useEffect, useRef, type ReactNode } from 'react';
import { utilsClearCesiumLog } from '../../02_entities';

// ✅ 01. Cesium Camera initial Setting - 세밀한 설정
// 서울시청 : 37.5667, 126.9784
const seoulCityHall = {
  lon: 126.9784,
  lat: 37.5667,
};
Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(
  seoulCityHall.lon - 0.01, // 서쪽
  seoulCityHall.lat - 0.01, // 남쪽
  seoulCityHall.lon + 0.01, // 동쪽
  seoulCityHall.lat + 0.01 // 북쪽
);
Cesium.Camera.DEFAULT_VIEW_FACTOR = 0;

export const CesiumInit = (): ReactNode => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Cesium.Viewer | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // ✅ 02. Cesium 인스턴스 생성 및 상태관리
    const viewer = new Cesium.Viewer(container, {
      animation: false,
      timeline: false,
      baseLayerPicker: false,
      geocoder: false,
      sceneModePicker: false,
      homeButton: false,
      navigationHelpButton: false,
      infoBox: false,
      fullscreenButton: false,
    });

    viewerRef.current = viewer;

    // ✅ 03. 기본지도(Bing) 이외에 지우기, 뒤에서 부터 제거
    const layers = viewer.imageryLayers;
    for (let i = layers.length - 1; i >= 1; i--) {
      layers.remove(layers.get(i));
    }

    // ✅ 04. Cesium 인스턴스에 대한 스타일 제어
    utilsClearCesiumLog({ container });
    viewer.scene.globe.depthTestAgainstTerrain = true; // 3D 모델의 가시범위 설정(3D 지도의 경우, 산 뒤에 가리기)

    // ✅ 05. Cesium Camera initial Setting - 세밀한 설정
    // setView, flyTo 2종
    // Cesium.Cartesian3.fromDegrees(경도, 위도, 고도(meter))

    return () => {
      // ✅ 06. viewerRef.current 인스턴스에 대한 라이프사이클
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, []);

  return <div ref={containerRef} style={{ height: '100vh' }} />;
};
