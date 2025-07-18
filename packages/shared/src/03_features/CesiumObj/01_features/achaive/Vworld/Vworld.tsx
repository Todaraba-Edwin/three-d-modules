import { useEffect, useRef, useState, type ReactNode } from 'react';
import * as Cesium from 'cesium';
import { utilsClearCesiumLog } from '../../../02_entities';
const VITE_BASE_VWORLD = import.meta.env.VITE_BASE_VWORLD;

type SelectType = 'Base' | 'Satellite' | 'Hybrid' | 'midnight';

export const Vworld = (): ReactNode => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Cesium.Viewer | null>(null);
  const [selectMap, setSelectMap] = useState<SelectType>('Base');

  // const [show, setShow] = useState(false);

  // useEffect(() => {
  //   const timeout = setTimeout(() => setShow(true), 800);
  //   return () => clearTimeout(timeout);
  // }, []);

  const seoulCityHall = Cesium.Cartesian3.fromDegrees(
    126.978,
    37.5665 - 0.005,
    300
  );

  // 1. Viewer 초기 생성
  useEffect(() => {
    if (!containerRef.current) return;

    let terrainProvider;
    const initCesium = async () => {
      terrainProvider = await Cesium.createWorldTerrainAsync();
    };

    initCesium();

    const viewer = new Cesium.Viewer(containerRef.current, {
      terrainProvider,
      // baseLayerPicker: false,
      geocoder: false,
      animation: false,
      timeline: false,
      sceneModePicker: false,
      navigationHelpButton: false,
      homeButton: false,
      fullscreenButton: false,
    });

    viewerRef.current = viewer;

    utilsClearCesiumLog({ container: containerRef.current });
    viewer.scene.globe.depthTestAgainstTerrain = true; // 3D 모델의 가시범위 설정 // 산 뒤에 가리기

    // 서울시청 위치

    viewer.camera.setView({
      destination: seoulCityHall,
      orientation: {
        heading: Cesium.Math.toRadians(0),
        pitch: Cesium.Math.toRadians(-30),
        roll: 0.0,
      },
    });

    // 3D 모델 추가 (optional)
    const addModel = async () => {
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

    addModel();

    return () => {
      viewer.destroy();
      viewerRef.current = null;
    };
    // eslint-disable-next-line
  }, []);

  // 2. selectMap 변경 시 imageryProvider 교체
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    // 기존 레이어 숨기기 또는 우선순위 조정 (옵션)
    // 예를 들어 첫 번째 레이어를 가장 아래로 내리기
    if (viewer.imageryLayers.length > 0) {
      const baseLayer = viewer.imageryLayers.get(0);
      if (baseLayer) {
        viewer.imageryLayers.lower(baseLayer);
        baseLayer.show = false; // 숨길 수도 있음
      }
    }

    // 새로운 레이어 추가 함수
    const addLayer = (url: string, alpha = 1.0) => {
      const provider = new Cesium.UrlTemplateImageryProvider({
        url,
        credit: 'VWorld',
      });
      const layer = viewer.imageryLayers.addImageryProvider(provider);
      layer.alpha = alpha; // 투명도 조절 가능
      layer.show = true;
      return layer;
    };

    const isSatellite = selectMap === 'Satellite';
    const isHybrid = selectMap === 'Hybrid';

    if (isSatellite) {
      addLayer(
        `https://api.vworld.kr/req/wmts/1.0.0/${VITE_BASE_VWORLD}/Satellite/{z}/{y}/{x}.jpeg`
      );
      return;
    }

    if (isHybrid) {
      // 위성 레이어 먼저 추가 (투명도 설정 가능)
      const satelliteLayer = addLayer(
        `https://api.vworld.kr/req/wmts/1.0.0/${VITE_BASE_VWORLD}/Satellite/{z}/{y}/{x}.jpeg`
      );
      // 하이브리드 레이어를 위에 추가
      const hybridLayer = addLayer(
        `https://api.vworld.kr/req/wmts/1.0.0/${VITE_BASE_VWORLD}/Hybrid/{z}/{y}/{x}.png`,
        0.8
      );

      // 필요하면 우선순위 조절
      viewer.imageryLayers.raiseToTop(satelliteLayer);
      viewer.imageryLayers.raiseToTop(hybridLayer);
      return;
    }

    // Base, midnight 등 단일 레이어 처리
    addLayer(
      `https://api.vworld.kr/req/wmts/1.0.0/${VITE_BASE_VWORLD}/${selectMap}/{z}/{y}/{x}.png`
    );
  }, [selectMap]);

  const goToInitialPosition =
    ({ destination }: { destination: Cesium.Cartesian3 }) =>
    () => {
      if (!viewerRef.current) return;

      // const viewerElement = document.querySelector(
      //   '.cesium-viewer'
      // ) as HTMLElement;

      // if (viewerElement) {
      //   viewerElement.style.opacity = '0';
      // }
      // setTimeout(() => {
      //   if (viewerElement) {
      //     viewerElement.style.opacity = '1';
      //   }
      // }, 800);

      viewerRef.current.camera.setView({
        destination,
        orientation: {
          heading: Cesium.Math.toRadians(0),
          pitch: Cesium.Math.toRadians(-30),
          roll: 0,
        },
      });
    };

  return (
    <div
      ref={containerRef}
      // className={`fade-in ${show ? 'show' : ''}`}
      style={{ width: '100%', height: '100vh', position: 'relative' }}
    >
      <div
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          zIndex: 99,
          backgroundColor: 'white',
        }}
      >
        <select
          style={{ width: '100px' }}
          value={selectMap}
          onChange={e => setSelectMap(e.target.value as SelectType)}
        >
          <option value='Base'>기본지도</option>
          <option value='Satellite'>위성지도</option>
          <option value='Hybrid'>하이브리드</option>
          <option value='midnight'>미드나잇모드</option>
        </select>
      </div>

      <div
        style={{
          position: 'absolute',
          top: '50px',
          left: '10px',
          zIndex: 99,
          backgroundColor: 'white',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          background: 'transparent',
        }}
      >
        <button
          style={{
            padding: '10px',
            background: '#ffffff',
          }}
          onClick={goToInitialPosition({ destination: seoulCityHall })}
        >
          초기위치로 돌아가기
        </button>
        <button
          style={{
            padding: '10px',
            background: '#ffffff',
          }}
          onClick={goToInitialPosition({
            destination: Cesium.Cartesian3.fromDegrees(126.5312, 33.4996, 300),
          })}
        >
          제주도 돌아가기
        </button>
        <button
          style={{
            padding: '10px',
            background: '#ffffff',
          }}
          onClick={goToInitialPosition({
            destination: Cesium.Cartesian3.fromDegrees(130.899, 37.483, 300),
          })}
        >
          울릉도 돌아가기
        </button>
        <button
          style={{
            padding: '10px',
            background: '#ffffff',
          }}
          onClick={goToInitialPosition({
            destination: Cesium.Cartesian3.fromDegrees(131.8675, 37.235, 300),
          })}
        >
          독도 돌아가기
        </button>
        <button
          style={{
            padding: '10px',
            background: '#ffffff',
          }}
          onClick={goToInitialPosition({
            destination: Cesium.Cartesian3.fromDegrees(129.0756, 35.1796, 300),
          })}
        >
          부산 돌아가기
        </button>
      </div>
    </div>
  );
};
