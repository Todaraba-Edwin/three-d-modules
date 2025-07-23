import { useEffect } from 'react';
import * as Cesium from 'cesium';
import * as Util from '../04_utils';
import type * as Ty from '../05_shared/types';
import { CesiumCoordinate } from '../05_shared/cesiumConst';

const EPSILON = Cesium.Math.toRadians(0.1);
export const useEffectCesiumViewerNoneGlobe = ({
  containerRef,
  setViewer,
}: Ty.useEffectCesiumViewerProps): void => {
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

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

    setViewer(viewer);

    // 초기 카메라 이동
    const position = Cesium.Cartesian3.fromDegrees(
      CesiumCoordinate.lon,
      CesiumCoordinate.lat - 0.0015,
      80 // 조금 위쪽
    );

    viewer.camera.setView({
      destination: position,
      orientation: {
        heading: Cesium.Math.toRadians(0),
        pitch: Cesium.Math.toRadians(-25),
        roll: 0.0,
      },
    });

    viewer.scene.globe.show = false; // 지구 제거
    viewer.scene.skyBox.show = false; // 별자리 제거
    viewer.scene.skyAtmosphere.show = false; // 대기권 제거
    viewer.scene.backgroundColor = Cesium.Color.NAVAJOWHITE;

    (async () => {
      const position = Cesium.Cartesian3.fromDegrees(
        CesiumCoordinate.lon,
        CesiumCoordinate.lat,
        0 // 조금 위쪽
      );
      const modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(position);

      const model = await Cesium.Model.fromGltfAsync({
        url: '/model/testmodules.glb', // 실제 GLB 경로로 교체
        modelMatrix,
        scale: 1.0, // 필요 시 조정
      });

      viewer.scene.primitives.add(model);

      const position2 = Cesium.Cartesian3.fromDegrees(
        CesiumCoordinate.lon + 0.0007,
        CesiumCoordinate.lat,
        0 // 조금 위쪽
      );
      const modelMatrix2 = Cesium.Transforms.eastNorthUpToFixedFrame(position2);

      const model2 = await Cesium.Model.fromGltfAsync({
        url: '/model/test2.glb', // 실제 GLB 경로로 교체
        modelMatrix: modelMatrix2,
        scale: 2.0, // 필요 시 조정
      });

      viewer.scene.primitives.add(model2);

      const position3 = Cesium.Cartesian3.fromDegrees(
        CesiumCoordinate.lon + 0.0025,
        CesiumCoordinate.lat,
        0 // 조금 위쪽
      );

      const hpr = new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(90), 0, 0);

      const modelMatrix3 = Cesium.Transforms.headingPitchRollToFixedFrame(
        position3,
        hpr
      );

      const model3 = await Cesium.Model.fromGltfAsync({
        url: '/model/testmodules.glb', // 실제 GLB 경로로 교체
        modelMatrix: modelMatrix3,
        scale: 1.0, // 필요 시 조정
      });

      viewer.scene.primitives.add(model3);
    })();

    Util.utilsClearCesiumLog({ container });
    // Util.utilsRemoteDepthTestAgainstTerrain({ viewer });
    Util.utilsRemoteZoomDistance({ viewer, isBuildingMode: true });

    viewer.scene.postUpdate.addEventListener(() => {
      if (Math.abs(viewer.camera.roll) > EPSILON) {
        viewer.camera.setView({
          destination: viewer.camera.positionWC,
          orientation: {
            heading: viewer.camera.heading,
            pitch: viewer.camera.pitch,
            roll: 0.0,
          },
        });
      }
    });

    return () => {
      viewer.destroy();
      setViewer(null);
    };
    // eslint-disable-next-line
  }, []);
  return;
};
