import {
  CesiumInitBody,
  useCesiumInitNoneGlobe,
  useSetGltfAsync,
  utilsGetListBoundary,
} from '@monorepo/shared';
import { utilsSetInitCameraPosition } from '@monorepo/shared/features/Cesium/04_utils/utilsSetInitCameraPosition';
import * as Cesium from 'cesium';
import clsx from 'clsx';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  GLB_ModuleList,
  initCameraPosition,
  LineList,
  LineList2,
  LineList21,
  LineList22,
  LineList23,
  LineList24,
  LineList25,
  LineList26,
  LineList3,
  LineList4,
  LineList5,
  SelectedFloorWithType,
  utilsGetDegreeFromMeter,
  type GlbListType,
} from './parts/prizm';

const allLineLists: Record<string, any[][][]> = {
  '1': [LineList, LineList2, LineList3, LineList4, LineList5],
  '2': [LineList21, LineList22, LineList23, LineList24, LineList25, LineList26],
  // '3': [LineList31, LineList32, LineList33, LineList34, LineList35],
};

export const ThreeDMsPage = (): ReactNode => {
  const [glbList, setGlbList] = useState<GlbListType[]>(() => GLB_ModuleList);
  const [selectedType, setSelectedType] = useState<'origin' | 'protruding'>(
    'origin'
  );
  const [selectedFloor, setSelectedFloor] = useState<number>(0);
  const boundaryCoordinate = utilsGetListBoundary({ list: glbList });
  const { containerRef, viewerRef } = useCesiumInitNoneGlobe({
    boundaryCoordinate,
    cameraInitCoordinate: {
      lon: 1,
      lat: 1,
    },
    initCameraHeight: 1,
    initCameraPosition: initCameraPosition,
  });
  const lineEntitiesRef = useRef<Cesium.Entity[]>([]);

  useSetGltfAsync({
    viewer: viewerRef,
    glbList: glbList,
    boundaryCoordinate,
    selectedFloor,
  });

  const onFloorCameraFlyTo = ({
    lat,
    lon,
    height,
    heading,
    pitch,
  }: Record<string, number>) => {
    if (viewerRef) {
      const position = utilsSetInitCameraPosition({
        coordinate: {
          lat,
          lon,
        },
        initCameraHeight: height,
      });

      viewerRef.camera.flyTo({
        destination: position,
        orientation: {
          heading: Cesium.Math.toRadians(heading),
          pitch: Cesium.Math.toRadians(pitch),
          roll: 0,
        },
        duration: 1.5,
      });
    }
  };

  const onSetGlbList = (type: 'origin' | 'protruding') => () => {
    switch (type) {
      case 'origin':
        setSelectedType('origin');
        setGlbList(() => {
          const newList = GLB_ModuleList.map(list => ({
            ...list,
            positions: { ...list.positions },
          }));
          return newList;
        });
        onFloorCameraFlyTo(SelectedFloorWithType['origin'][selectedFloor]);
        break;
      case 'protruding':
        setSelectedType('protruding');
        if (selectedFloor === 0) {
          setSelectedFloor(1);
          onFloorCameraFlyTo(SelectedFloorWithType['protruding'][1]);
        } else {
          onFloorCameraFlyTo(
            SelectedFloorWithType['protruding'][selectedFloor]
          );
        }

        setGlbList(() => {
          const newList = GLB_ModuleList.map((list, idx) => {
            const weight = idx <= 1 ? 0 : idx - 1;
            const isFloor = selectedFloor === idx;
            const isDevice = idx > 4;
            const floorIndex =
              GLB_ModuleList.findIndex(({ type }) => type === list.type) - 1;
            const isSelectedFloor = floorIndex + 1 === selectedFloor;

            return {
              ...list,
              positions: {
                ...list.positions,
                height: isDevice
                  ? 30 * floorIndex + list.positions.height
                  : 30 * weight,
                lon:
                  idx === 0
                    ? list.positions.lon
                    : isDevice && isSelectedFloor
                      ? list.positions.lon
                      : isDevice && !isSelectedFloor
                        ? list.positions.lon +
                          utilsGetDegreeFromMeter({
                            type: 'lon',
                            meter: 100,
                            lat: list.positions.lat,
                          })
                        : isFloor
                          ? list.positions.lon
                          : list.positions.lon +
                            utilsGetDegreeFromMeter({
                              type: 'lon',
                              meter: 100,
                              lat: list.positions.lat,
                            }),
              },
            };
          });
          return newList;
        });
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (selectedType === 'origin') {
      onSetGlbList('origin')();
    } else {
      onSetGlbList('protruding')();
    }

    // eslint-disable-next-line
  }, [selectedFloor, selectedType]);

  useEffect(() => {
    if (!viewerRef) return;

    lineEntitiesRef.current.forEach(entity =>
      viewerRef.entities.remove(entity)
    );
    lineEntitiesRef.current = [];

    const lonOffset = utilsGetDegreeFromMeter({
      type: 'lon',
      meter: 100,
      lat: initCameraPosition.lat,
    });

    for (const floor in allLineLists) {
      const floorNum = parseInt(floor, 10);

      if (
        selectedType === 'origin' &&
        selectedFloor !== 0 &&
        selectedFloor !== floorNum
      ) {
        continue;
      }

      const lists = allLineLists[floor];
      lists.forEach(lineDef => {
        lineDef.forEach((line: any) => {
          // 1. Build the base path from instructions
          const basePath: any[] = [];
          if (line.coordinates.length > 0) {
            basePath.push(line.coordinates[0]);

            for (let i = 1; i < line.coordinates.length; i++) {
              const instruction = line.coordinates[i];
              const lastPoint = basePath[basePath.length - 1];

              if (instruction.type === 'vertical') {
                basePath.push({
                  ...instruction,
                  lat: lastPoint.lat,
                  lon: lastPoint.lon,
                  height: lastPoint.height + instruction.length,
                });
              } else {
                basePath.push(instruction);
              }
            }
          }

          // 2. Apply dynamic offsets
          const finalPath = basePath.map(coord => {
            let height = coord.height;
            let lon = coord.lon;

            if (selectedType === 'protruding') {
              height += 30 * (floorNum - 1);
              if (selectedFloor !== floorNum) {
                lon += lonOffset;
              }
            }
            return { ...coord, lon, height };
          });

          // 3. Draw the entity
          const flatCoords = finalPath.flatMap(p => [p.lon, p.lat, p.height]);
          if (flatCoords.length < 6) return;

          const entity = viewerRef.entities.add({
            polyline: {
              positions: Cesium.Cartesian3.fromDegreesArrayHeights(flatCoords),
              width: 5,
              material: Cesium.Color.CYAN,
            },
          });
          lineEntitiesRef.current.push(entity);
        });
      });
    }
  }, [selectedFloor, selectedType, viewerRef]);

  useEffect(() => {
    if (!viewerRef) return;

    const handler = new Cesium.ScreenSpaceEventHandler(viewerRef.scene.canvas);
    handler.setInputAction(
      (movement: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
        const cartesian = viewerRef.scene.pickPosition(movement.position);
        if (cartesian) {
          const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
          const longitude = Cesium.Math.toDegrees(cartographic.longitude);
          const latitude = Cesium.Math.toDegrees(cartographic.latitude);
          const height = cartographic.height;
          console.log('더블클릭 3D 좌표 (lon, lat, height):', {
            longitude,
            latitude,
            height,
          });
        }
      },
      Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
    );

    // 컴포넌트 언마운트 시 핸들러 정리
    return () => {
      handler.destroy();
    };
  }, [viewerRef]);

  return (
    <CesiumInitBody
      isFullHeight
      containerRef={containerRef}
      isNonBackground
      children={
        <div className='absolute top-10 right-4 z-40 flex flex-col items-end gap-2 '>
          <div className='flex  gap-x-1 rounded-lg bg-gray-900/50 p-1 backdrop-blur-sm'>
            {selectedType === 'origin'
              ? [0, 1, 2, 3, 4].map(list => (
                  <button
                    key={list}
                    className={clsx(
                      'rounded-md px-4 py-1.5 text-sm font-medium text-white transition-colors focus:outline-none',
                      {
                        'bg-blue-600': selectedFloor === list,
                        'hover:bg-white/10': selectedFloor !== list,
                      }
                    )}
                    onClick={() => {
                      setSelectedFloor(list);
                    }}
                    children={list === 0 ? '층 선택 해제' : `${list}층`}
                  />
                ))
              : [1, 2, 3, 4].map(list => (
                  <button
                    key={list}
                    className={clsx(
                      'rounded-md px-4 py-1.5 text-sm font-medium text-white transition-colors focus:outline-none',
                      {
                        'bg-blue-600': selectedFloor === list,
                        'hover:bg-white/10': selectedFloor !== list,
                      }
                    )}
                    onClick={() => {
                      setSelectedFloor(list);
                    }}
                    children={`${list}층`}
                  />
                ))}
          </div>
          <div className='flex gap-x-1 rounded-lg bg-gray-900/50 p-1 backdrop-blur-sm'>
            <button
              className={clsx(
                'rounded-md px-6 py-1.5 text-sm font-medium text-white transition-colors focus:outline-none',
                {
                  'bg-blue-600': selectedType === 'origin',
                  'hover:bg-white/10': selectedType !== 'origin',
                }
              )}
              onClick={onSetGlbList('origin')}
              children={'기본형'}
            />
            <button
              className={clsx(
                'rounded-md px-6 py-1.5 text-sm font-medium text-white transition-colors focus:outline-none',
                {
                  'bg-blue-600': selectedType === 'protruding',
                  'hover:bg-white/10': selectedType !== 'protruding',
                }
              )}
              onClick={onSetGlbList('protruding')}
              children={'돌출형'}
            />
          </div>
        </div>
      }
    />
  );
};
