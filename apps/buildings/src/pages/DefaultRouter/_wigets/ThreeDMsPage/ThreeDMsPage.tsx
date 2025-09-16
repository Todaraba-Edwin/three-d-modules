import {
  CesiumInitBody,
  InitPosition,
  useCesiumInitNoneGlobe,
  useSetGltfAsync,
  utilsCesiumFlyto,
  utilsGetListBoundary,
} from '@monorepo/shared';
import { type ReactNode } from 'react';
import {
  buildingCoordinate,
  prizmLists,
  utilsGetDegreeFromMeter,
} from './parts/prizm';

export const ThreeDMsPage = (): ReactNode => {
  const boundaryCoordinate = utilsGetListBoundary({ list: prizmLists });
  const { containerRef, viewerRef } = useCesiumInitNoneGlobe({
    boundaryCoordinate,
    cameraInitCoordinate: {
      lon:
        buildingCoordinate.lon +
        utilsGetDegreeFromMeter({
          type: 'lon',
          meter: -310,
          lat: buildingCoordinate.lat,
        }),
      lat:
        buildingCoordinate.lat +
        utilsGetDegreeFromMeter({
          type: 'lat',
          meter: 175,
        }),
    },
    initCameraHeight: 150,
  });

  useSetGltfAsync({
    viewer: viewerRef,
    glbList: prizmLists,
    boundaryCoordinate,
    isFloor: true,
  });

  console.log(viewerRef?.camera);

  return (
    <CesiumInitBody
      isFullHeight
      containerRef={containerRef}
      isNonBackground
      children={
        <div className='absolute bottom-10 left-4 z-40 grid grid-cols-1'>
          {prizmLists.map(({ name, type, cameraPosition }) => (
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
          />
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
