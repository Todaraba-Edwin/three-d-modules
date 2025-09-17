import {
  CesiumInitBody,
  useCesiumInitNoneGlobe,
  useSetGltfAsync,
  utilsAddLines,
  // utilsAddLines,
  utilsGetListBoundary,
} from '@monorepo/shared';
import { utilsSetInitCameraPosition } from '@monorepo/shared/features/Cesium/04_utils/utilsSetInitCameraPosition';
import * as Cesium from 'cesium';
import clsx from 'clsx';
import { useEffect, useState, type ReactNode } from 'react';
import {
  GLB_ModuleList,
  initCameraPosition,
  LineList,
  LineList2,
  LineList3,
  LineList4,
  LineList5,
  // LineList,
  // LineList2,
  SelectedFloorWithType,
  utilsGetDegreeFromMeter,
  type GlbListType,
} from './parts/prizm';

export const ThreeDMsPage = (): ReactNode => {
  const [glbList, setGlbList] = useState<GlbListType[]>(() => GLB_ModuleList);
  const [selectedType, setSelectedType] = useState<'origin' | 'protruding'>(
    'origin'
  );
  const [selectedFloor, setSelectedFloor] = useState<number>(0);
  const [lineEntities, setLineEntities] = useState<Cesium.Entity[]>([]);
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
            positions: { ...list.positions, height: 0 },
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

  // // 라인 추가하기
  useEffect(() => {
    [LineList, LineList2, LineList3, LineList4, LineList5].forEach(list => {
      list.forEach(({ coordinates }: any) => {
        utilsAddLines({
          viewer: viewerRef,
          lines: coordinates,
        });
      });
    });
  }, [viewerRef, boundaryCoordinate]);

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

/*

  useEffect(() => {
    setTimeout(() => {
      if (!viewerRef) return;

      fetch('/mock/lineList.json')
        .then(res => res.json())
        .then(({ data }) => {
          if (data.length === 0) return;

          //eslint-disable-next-line
          data.forEach(({ coordinates }: any) => {
            utilsAddLines({
              viewer: viewerRef,
              lines: coordinates,
            });
          });
        })
        .catch(e => console.error(e));
    });
  }, [viewerRef, boundaryCoordinate]);*/

{
  /* {prizmLists.map(({ name, type, cameraPosition }) => (
            <button
              key={name}
              className='p-2 text-gray-700 bg-red-100 rounded-sm mb-2'
              onClick={utilsCesiumFlyto({
                viewer: viewerRef,
                name,
                type,
                position: cameraPosition,
              })}
              children={name}
            />
          ))}
          <button
            className='p-2 text-gray-700 bg-red-100 rounded-sm mb-2'
            onClick={utilsCesiumFlyto({
              viewer: viewerRef,
              type: '',
              name: InitPosition,
              position: {
                ...boundaryCoordinate.center,
                height: 200,
              },
            })}
            children={'초기 위치'}
          /> */
}
