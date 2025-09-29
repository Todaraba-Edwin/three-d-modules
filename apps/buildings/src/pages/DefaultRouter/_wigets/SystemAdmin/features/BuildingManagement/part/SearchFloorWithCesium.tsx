import {
  CesiumInitBody,
  useCesiumInitNoneGlobe,
  useSetGltfAsync,
  utilsGetListBoundary,
  utilsSetInitCameraPosition,
} from '@monorepo/shared';
import { utilsGetDegreeFromMeter } from '@monorepo/shared/features/Cesium/04_utils/utilsGetDegreeFromMeter';
import type { cameraPositionType } from '@monorepo/shared/features/Cesium/05_shared/types';
import * as Cesium from 'cesium';
import clsx from 'clsx';
import { Mouse } from 'lucide-react';
import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

const FIXED_POSITION = {
  lat: 37.5667,
  lon: 126.9784,
};

export const SearchFloorNone = (): ReactNode => {
  return (
    <div className='w-full h-full flex flex-col space-y-2 items-center justify-center'>
      <Mouse className='w-10 h-10' />
      <p>왼쪽에서 층을 선택해주세요.</p>
    </div>
  );
};

export const SearchFloorWithCesium = (): ReactNode => {
  const [latOffset, setLatOffset] = useState(100);
  const [lonOffset, setLonOffset] = useState(600);
  const [height, setHeight] = useState(500);
  const [heading, setHeading] = useState(90);
  const [pitch, setPitch] = useState(-40);

  const cameraPosition = useMemo(
    () => ({
      lat:
        FIXED_POSITION.lat -
        utilsGetDegreeFromMeter({ type: 'lat', meter: latOffset }),
      lon:
        FIXED_POSITION.lon -
        utilsGetDegreeFromMeter({
          type: 'lon',
          meter: lonOffset,
          lat: FIXED_POSITION.lat,
        }),
      height,
      heading,
      pitch,
    }),
    [latOffset, lonOffset, height, heading, pitch]
  );

  const glbObject = useMemo(
    () => ({
      name: 'BottomSurface',
      type: 'BottomSurface',
      url: '/imgs/G1.glb',
      isError: false,
      positions: {
        lat: FIXED_POSITION.lat,
        lon: FIXED_POSITION.lon,
        height: 0,
        heading: 0,
      },
      get cameraPosition(): cameraPositionType {
        return cameraPosition;
      },
    }),
    [cameraPosition]
  );

  const boundaryCoordinate = utilsGetListBoundary({ list: [glbObject] });

  const { containerRef, viewerRef } = useCesiumInitNoneGlobe({
    boundaryCoordinate,
    cameraInitCoordinate: {
      lon: 1,
      lat: 1,
    },
    initCameraHeight: 1,
    initCameraPosition: cameraPosition,
  });

  useSetGltfAsync({
    viewer: viewerRef,
    glbList: [glbObject],
    boundaryCoordinate,
  });

  const onFloorCameraFlyTo = useCallback(
    ({
      lat,
      lon,
      height,
      heading,
      pitch,
      duration,
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
          duration,
        });
      }
    },
    [viewerRef]
  );

  useEffect(() => {
    onFloorCameraFlyTo({ ...cameraPosition, duration: 0.3 });
  }, [cameraPosition, onFloorCameraFlyTo]);

  return (
    <div className='grid grid-rows-[auto_1fr] w-full h-full'>
      <div>
        <dl
          className={clsx(
            'p-4 bg-slate-50 border-b-2',
            'grid grid-cols-[100px_auto] w-full h-fit  gap-y-2 text-base',
            'max-xl:grid-rows-3'
          )}
        >
          <dt className='text-slate-500'>해당층 정보</dt>
          <dd className='font-semibold pr-4'>지상 11층</dd>
          <dt className='text-slate-500'>해당층 설명</dt>
          <dd className='font-semibold pr-4'>
            지상 11층으로 창작과가 위치해 있으며, 3D프린터 및 레이저커팅기 등이
            구비
          </dd>
          <dt className='text-slate-500'>GLB 파일정보</dt>
          <dd className='font-semibold pr-4'>/media/glbs/F_01.glb</dd>
        </dl>

        <div className='p-4 bg-slate-50 border-b-2'>
          <h3 className='text-slate-500'>카메라 초기위치설정</h3>
          <label htmlFor='latOffset'>위도조절(m)</label>
          <input
            id='latOffset'
            type='number'
            min='-500'
            max='500'
            value={latOffset}
            onChange={e => setLatOffset(Number(e.target.value))}
          />

          <label htmlFor='lonOffset'>경도 조절(m)</label>
          <input
            id='lonOffset'
            type='number'
            min='-600'
            max='600'
            value={lonOffset}
            onChange={e => setLonOffset(Number(e.target.value))}
          />

          <label htmlFor='height'>눂이 조절(m)</label>
          <input
            id='height'
            type='number'
            min='100'
            max='500'
            value={height}
            onChange={e => setHeight(Number(e.target.value))}
          />

          <label htmlFor='heading'>카메라좌우각 조절</label>
          <input
            id='heading'
            type='number'
            min='0'
            max='360'
            value={heading}
            onChange={e => setHeading(Number(e.target.value))}
          />

          <label htmlFor='pitch'>카메라상하각 조절</label>
          <input
            id='pitch'
            type='number'
            min='-90'
            max='0'
            value={pitch}
            onChange={e => setPitch(Number(e.target.value))}
          />
        </div>
      </div>

      <div className='w-full h-full relative'>
        <CesiumInitBody
          addTailwindClassName='w-full h-full'
          containerRef={containerRef}
          isNonBackground
          children={
            <>
              <div className=' absolute top-0 left-0 '>
                <button
                  onClick={() => {
                    onFloorCameraFlyTo({
                      ...cameraPosition,
                      duration: 1.5,
                    });
                  }}
                  children='초기위치'
                />
              </div>
            </>
          }
        />
      </div>
    </div>
  );
};
