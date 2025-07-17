import { useEffect, useRef, type ReactNode } from 'react';
import * as Cesium from 'cesium';
import * as Entity from '../../02_entities';

export const Cesium3DModules = ():ReactNode => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    const viewer = new Cesium.Viewer(container, {
      animation: false, // 좌측 하단의 애니메이션 위젯 제거
      timeline: false, // 타임라인 제거
      sceneModePicker: false, // 우상단 2D/3D 전환 버튼 제거
      baseLayerPicker: false, // 우상단 지도 타입 선택 제거
      homeButton: false, // 홈 버튼 제거
      navigationHelpButton: false, // 우상단 도움말 제거
    });

    Entity.utilsClearCesiumLog({ container });
    Entity.utilsControlToolbox({
      container: containerRef.current,
      type: Entity.ControlToolboxType.SEARCH_FULLSCREEN,
    });

    Entity.utilsClearCesiumLog({ container });

    // viewer.scene.globe.show = false; // 지구본 제거
    // viewer.scene.skyBox.show = false;
    // viewer.scene.skyAtmosphere.show = false;
    // viewer.scene.moon.show = false;
    // viewer.scene.sun.show = false;

    const seoulCityHall = Cesium.Cartesian3.fromDegrees(126.978, 37.5665, 0);

    const utuilGetOSMbuilds = async () => {
      const osmBuildings = await Cesium.createOsmBuildingsAsync();
      viewer.scene.primitives.add(osmBuildings);
    };

    utuilGetOSMbuilds();

    const run = async () => {
      const modelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(
        seoulCityHall, //Cesium.Cartesian3.fromDegrees(0, 0, 0), // 좌표계 상의 중심(position),
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

      viewer.camera.lookAt(
        seoulCityHall, //Cesium.Cartesian3.fromDegrees(0, 0, 0), // 피사체 중심
        new Cesium.Cartesian3(-30.0, -100.0, 50.0) // 남쪽으로 20m 뒤, 위로 20m
      );
    };

    run();

    return () => viewer.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '100vh' }} />;
};
