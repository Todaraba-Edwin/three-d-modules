import { useEffect, useRef } from 'react';
import * as Cesium from 'cesium';

// export default function CesiumMap() {
export const CesiumMap = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Cesium.Viewer | null>(null);
  console.log('테스트 ##1');

  useEffect(() => {
    const initCesium = async () => {
      if (!containerRef.current) return;

      const terrainProvider = await Cesium.createWorldTerrainAsync();

      const viewer = new Cesium.Viewer(containerRef.current, {
        terrainProvider,
        shouldAnimate: true,
        animation: false, // 좌측 하단의 애니메이션 위젯 제거
        timeline: false, // 타임라인 제거
        // infoBox: false, // 엔티티 정보 박스 제거
        sceneModePicker: false, // 우상단 2D/3D 전환 버튼 제거
        baseLayerPicker: false, // 우상단 지도 타입 선택 제거
        // geocoder: false, // 우상단 검색창 제거
        homeButton: false, // 홈 버튼 제거
        navigationHelpButton: false, // 우상단 도움말 제거
        // fullscreenButton: false, // 전체화면 버튼 제거
      });

      viewerRef.current = viewer;

      const creditWrapper = document.querySelector('.cesium-widget-credits');
      if (creditWrapper instanceof HTMLElement) {
        creditWrapper.style.setProperty('display', 'none');
      }

      const cesiumToolbar = document.querySelector('.cesium-viewer-toolbar');
      if (cesiumToolbar instanceof HTMLElement) {
        // cesiumToolbar.style.setProperty('position', 'relative'); // 위치 조정
        cesiumToolbar.style.setProperty('right', '40px');
      }

      const cesiumFullscreenContainer = document.querySelector(
        '.cesium-viewer-fullscreenContainer'
      );
      if (cesiumFullscreenContainer instanceof HTMLElement) {
        cesiumFullscreenContainer.style.setProperty(
          'transform',
          'scale(1.1111)'
        );
        cesiumFullscreenContainer.style.setProperty(
          'transformOrigin',
          'top right'
        );
        cesiumFullscreenContainer.style.setProperty('top', '6px');
        cesiumFullscreenContainer.style.setProperty('right', '8px');
      }

      const osmBuildings = await Cesium.createOsmBuildingsAsync();
      viewer.scene.primitives.add(osmBuildings);

      const destination = Cesium.Cartesian3.fromDegrees(126.9784, 37.5667, 250);
      viewer.camera.setView({
        destination,
        orientation: {
          heading: Cesium.Math.toRadians(0.0), // 북쪽
          pitch: Cesium.Math.toRadians(-30.0), // 아래로 30도
          roll: 0.0,
        },
      });

      return () => {
        viewer.destroy();
      };
    };

    initCesium();
  }, []);

  return (
    <>
      <div ref={containerRef} style={{ height: '100vh' }} />
    </>
  );
};
