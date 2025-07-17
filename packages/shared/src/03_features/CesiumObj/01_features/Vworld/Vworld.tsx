import { useEffect, useRef, type ReactNode } from 'react';
import * as Cesium from 'cesium';

Cesium.Ion.defaultAccessToken = ''; // Ion 기능 비활성화

export const Vworld = (): ReactNode => {
  const containerRef = useRef<HTMLDivElement>(null);
  const API_KEY = '70A981D3-1683-3BA1-B0D7-085561FF70C5'; // 여기에 VWorld API 키 입력

  useEffect(() => {
    if (!containerRef.current) return;

    const viewer = new Cesium.Viewer(containerRef.current, {
      baseLayerPicker: false,
      geocoder: false,
      animation: false,
      timeline: false,
      sceneModePicker: false,
      navigationHelpButton: false,
      homeButton: false,
      fullscreenButton: false,
    });

    // Base, Satellite, Hybrid, midnight
    viewer.imageryLayers.removeAll(); // 기본 imagery 제거

    // viewer.imageryLayers.addImageryProvider(
    //   new Cesium.UrlTemplateImageryProvider({
    //     // url: `https://api.vworld.kr/req/wmts/1.0.0/${API_KEY}/midnight/{z}/{y}/{x}.png`,
    //     url: `https://api.vworld.kr/req/wmts/1.0.0/${API_KEY}/Satellite/{z}/{y}/{x}.jpeg`, // png 대신 jpeg 시도
    //     credit: 'VWorld',
    //   })
    // );

    viewer.imageryLayers.addImageryProvider(
      new Cesium.UrlTemplateImageryProvider({
        url: `https://api.vworld.kr/req/wmts/1.0.0/${API_KEY}/midnight/{z}/{y}/{x}.png`,
        credit: 'VWorld',
      })
    );

    // 서울시청 위치: 위도 37.5665, 경도 126.978
    const seoulCityHall = Cesium.Cartesian3.fromDegrees(126.978, 37.5665, 300);

    const run = async () => {
      const modelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(
        Cesium.Cartesian3.fromDegrees(126.978, 37.5665, 0),
        Cesium.HeadingPitchRoll.fromDegrees(0, 0, 0)
      );

      const model = await Cesium.Model.fromGltfAsync({
        url: '/model/testmodules.glb',
        modelMatrix,
        scale: 1,
        allowPicking: true,
        asynchronous: true,
      });

      viewer.scene.primitives.add(model);
    };

    run();

    viewer.camera.setView({
      destination: seoulCityHall,
      orientation: {
        heading: Cesium.Math.toRadians(0),
        pitch: Cesium.Math.toRadians(-30),
        roll: 0.0,
      },
    });

    return () => viewer.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '100vh' }} />;
};
