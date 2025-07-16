import { useEffect, useRef } from 'react';
import * as Cesium from 'cesium';
import * as Entity from '../../02_entities';

export const Cesium3DModules = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    const viewer = new Cesium.Viewer(container, {
      baseLayerPicker: false,
      geocoder: false,
      homeButton: false,
      sceneModePicker: false,
      navigationHelpButton: false,
      animation: false,
      timeline: false,
      fullscreenButton: false,
      vrButton: false,
    });

    Entity.utilsClearCesiumLog({ container });

    viewer.scene.globe.show = false; // 지구본 제거
    viewer.scene.skyBox.show = false;
    viewer.scene.skyAtmosphere.show = false;
    viewer.scene.moon.show = false;
    viewer.scene.sun.show = false;

    const run = async () => {
      const position = Cesium.Cartesian3.fromDegrees(0, 0, 0); // 좌표계 상의 중심
      const heading = 0.0;
      const pitch = 0.0;
      const roll = 0.0;

      const hpr = Cesium.HeadingPitchRoll.fromDegrees(heading, pitch, roll);
      const modelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(
        position,
        hpr
      );

      const model = await Cesium.Model.fromGltfAsync({
        url: '/model/testmodules.glb',
        modelMatrix,
        scale: 0.5,
        allowPicking: true,
        asynchronous: true,
      });

      viewer.scene.primitives.add(model);

      viewer.camera.flyTo({
        destination: position,
        orientation: { heading, pitch, roll },
      });
    };

    run();

    return () => viewer.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '100vh' }} />;
};
