import * as Cesium from 'cesium';

// Common Types
type UtilTypeRecordString = Record<string, string>;
type UtilTypeRecordStringArr = Record<string, string[]>;

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
};

export type CesiumVworldImageryLayersProps = {
  viewerRef: Cesium.Viewer | null;
  addImageryLayers: addImageryLayersType[];
  vWorldMapArrByType: UtilTypeRecordStringArr;
};

// Entities Typs
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

export type utilImageryLayersAddIsDefaultReturn = addImageryLayersType[];

/**
 * @file useCesiumAddVworldLayers.tsx
 */
export type useCesiumAddVworldLayersProps = {
  addImageryLayers: utilImageryLayersAddIsDefaultReturn;
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
};

/**
 * @file useEffectCesiumViewer.tsx
 */

export type useEffectCesiumViewerProps = {
  coordinate: {
    lon: number;
    lat: number;
  };
  containerRef: React.RefObject<HTMLDivElement | null>;
  addImageryLayers: useCesiumInitProps['addImageryLayers'];
  setViewer: React.Dispatch<React.SetStateAction<Cesium.Viewer | null>>;
};

/**
 * @file utilImageryLayersAddIsDefault.ts
 */

export type utilImageryLayersAddIsDefaultProps = {
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
