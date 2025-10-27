import * as Cesiums from 'cesium';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useEffectCesiumCameraController } from '../../03_hooks';

const VITE_CESIUM_ION = import.meta.env.VITE_CESIUM_ION;

Cesiums.Ion.defaultAccessToken = VITE_CESIUM_ION;

export const Cesium = (): ReactNode => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewer, setViewer] = useState<Cesiums.Viewer | null>(() => null);
  useEffectCesiumCameraController({ viewer });

  useEffect(() => {
    const initCesium = async () => {
      if (!containerRef.current) return;
      const container = containerRef.current;
      // 1️⃣ Cesium Viewer 생성 및 상태관리 //
      try {
        const viewer = new Cesiums.Viewer(container, {
          terrain: Cesiums.Terrain.fromWorldTerrain(),
          baseLayerPicker: false, // 필요 없으면 꺼도 됨
          animation: false,
          timeline: false,
          geocoder: false,
          sceneModePicker: false,
          homeButton: false,
          navigationHelpButton: false,
          infoBox: false,
          fullscreenButton: false,
          contextOptions: {
            webgl: {
              alpha: true, // ✅ 배경투명화 활성화
            },
          },
        });

        setViewer(viewer);

        // XYZ 타일 추가
        viewer.imageryLayers.addImageryProvider(
          new Cesiums.UrlTemplateImageryProvider({
            url: 'http://192.168.40.82:8080/tile-maps/{z}/{x}/{y}.png',
            maximumLevel: 18,
            minimumLevel: 6,
            tilingScheme: new Cesiums.WebMercatorTilingScheme(),
            rectangle: Cesiums.Rectangle.fromDegrees(120.0, 31.0, 134.0, 44.0),
          })
        );
      } catch (err) {
        console.error(err);
      }
      // 필요하면 기본 레이어 제거
      // viewer.imageryLayers.remove(viewer.imageryLayers.get(0));
    };

    initCesium();
  }, [containerRef]);

  return <div className='Cesium h-screen w-full' {...{ ref: containerRef }} />;
};
