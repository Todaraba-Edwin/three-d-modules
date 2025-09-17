import * as Cesium from 'cesium';

// Common Types
type UtilTypeRecordString = Record<string, string>;
type UtilTypeRecordStringArr = Record<string, string[]>;
type CoordinateType = {
  lon: number;
  lat: number;
};
type BoundaryCoordinateType = {
  west: number;
  east: number;
  south: number;
  north: number;
  center: {
    lon: number;
    lat: number;
  };
};
type positionsType = {
  lon: number;
  lat: number;
  height: number;
  heading?: number;
  scale?: number;
};

type cameraPositionType = {
  lon: number;
  lat: number;
  height: number;
  heading: number;
  pitch?: number;
};

export type vWorldTileMapType = 'Base' | 'Satellite' | 'Hybrid' | 'midnight';

export type containerProps = {
  container: HTMLElement;
};

export type vWorldMapInfoArrType = {
  type: string;
  typeName: string;
};

export type addImageryLayersType = vWorldMapInfoArrType & {
  url: string;
  isDefault: boolean;
};

// Components Props Types
export type CesiumInitBodyProps = PropsWithChildren & {
  containerRef: React.RefObject<HTMLDivElement | null>;
  isFullHeight?: boolean;
  isNonBackground?: boolean;
};

export type CesiumVworldImageryLayersProps = {
  viewerRef: Cesium.Viewer | null;
  addImageryLayers: addImageryLayersType[];
  vWorldMapArrByType: UtilTypeRecordStringArr;
};

// Entities Types
/**
 * @file useCesiumInit.tsx 관련
 */
export type useCesiumInitProps = {
  addImageryLayers?: {
    type: string;
    typeName: string;
    url: string;
    isDefault: boolean;
  }[];
  cameraInitCoordinate?: {
    lon: number;
    lat: number;
  };

  boundaryCoordinate?: BoundaryCoordinateType;
};

export type useCesiumInitNoneGlobeProps = {
  addImageryLayers?: {
    type: string;
    typeName: string;
    url: string;
    isDefault: boolean;
  }[];
  initCameraHeight?: number;
  cameraInitCoordinate?: BoundaryCoordinateType['center'];
  boundaryCoordinate: BoundaryCoordinateType;
  initCameraPosition?: cameraPositionType;
};

export type useCesiumInitReturn = {
  containerRef: React.RefObject<HTMLDivElement | null>;
  viewerRef: Cesium.Viewer | null;
};

export interface CustomImageryLayer extends Cesium.ImageryLayer {
  name?: string;
}

/**
 * @file useVworldMapInfo.tsx 관련
 */

export type usevWorldMapInfoReturn = {
  addImageryLayers: addImageryLayersType[];
  vWorldMapArrByType: UtilTypeRecordStringArr;
};

export type utilsImageryLayersAddIsDefaultReturn = addImageryLayersType[];

/**
 * @file useCesiumAddVworldLayers.tsx
 */
export type useCesiumAddVworldLayersProps = {
  addImageryLayers: utilsImageryLayersAddIsDefaultReturn;
  viewerRef: useCesiumInitReturn['viewerRef'];
  vWorldMapArrByType: UtilTypeRecordStringArr;
};

export type useCesiumAddVworldLayersReturn = {
  selectMap: string;
  // eslint-disable-next-line
  utilsSetSelectMap: ({ type }: { type: vWorldTileMapType }) => void;
};

/**
 * @file useEffectCesiumBoundaryLimit.tsx
 * @file useEffectCesiumCameraController.tsx
 * @file utilsRemoteDepthTestAgainstTerrain.tsx
 */

export type ViewerProps = {
  viewer: useCesiumInitReturn['viewerRef'];
  coordinate?: CoordinateType;
  boundaryCoordinate?: BoundaryCoordinateType;
  isBuildingMode?: boolean;
  containerRef?: React.RefObject<HTMLDivElement | null>;
};

/**
 * @file useEffectCesiumViewer.tsx
 */

export type useEffectCesiumViewerProps = {
  coordinate: CoordinateType;
  glbList?: GlbListType[];
  containerRef: React.RefObject<HTMLDivElement | null>;
  addImageryLayers: useCesiumInitProps['addImageryLayers'];
  setViewer: React.Dispatch<React.SetStateAction<Cesium.Viewer | null>>;
  initCameraHeight?: number;
  initCameraPosition?: cameraPositionType;
};

/**
 * @file utilsImageryLayersAddIsDefault.ts
 */

export type utilsImageryLayersAddIsDefaultProps = {
  apiKey?: string;
  arr: vWorldMapInfoArrType[];
};

// =======
export type utilsSetStyleProps = containerProps & {
  styleMap: UtilTypeRecordString;
};

export type utilsControlToolboxProps = containerProps & {
  type: ControlToolboxType;
};

/**
 * @file utilsSetGltfAsync.ts
 */

export type GlbListType = {
  name: string;
  type: string;
  url: string;
  positions: positionsType;
  cameraPosition: cameraPositionType;
  isError: boolean;
};

export type utilsSetGltfAsyncProps = {
  viewer: ViewerProps['viewer'];
  glbList: GlbListType[];
};

/**
 * @file utilsCesiumFlyto.ts
 */

export type utilsCesiumFlytoProps = {
  viewer: ViewerProps['viewer'];
  name: string;
  type: string;
  position: positionsType;
};

/**
 * @file utilsGetListBoundary.ts
 */

export type utilsGetListBoundaryReturn = BoundaryCoordinateType & {
  center: {
    lon: number;
    lat: number;
  };
};

/**
 * @file utilsSetInitCameraPosition.ts
 */

export type utilsSetInitCameraProps = {
  coordinate: useEffectCesiumViewerProps['coordinate'];
  initCameraHeight: number;
};
export type utilsSetInitCameraReturn = Cesium.Cartesian3;

/**
 * @file utilsSetModelID.ts
 */

export type utilsSetModelIDProp = {
  name: string;
  groupName?: string;
};

export type utilsGetModelIDReturn = utilsSetModelIDProp;
