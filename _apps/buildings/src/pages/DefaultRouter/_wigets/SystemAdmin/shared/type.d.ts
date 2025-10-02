type TabConst = {
  title: string;
  desc: string;
};

type SectionConst = TabConst & {
  ICON: LucideIcon;
  addActionName: string;
};

type ReactPropsWithChildrenAndTags<T extends keyof JSX.IntrinsicElements> =
  PropsWithChildren<React.ComponentProps<T>>;

/**
 * @file SearchBuildings.tsx */
type FormSearchBuildingsType = {
  search: string;
};

type GetBuildingsType = Record<'id' | 'buildingName' | 'address', string>;

/**
 * @file BM_RightBuildingCreate.tsx */
type BM_BuildingCreateForm = {
  buildingName: string;
  buildingDesc: string;
  address: string;
  buildingImageFile: FileList;
  groundFloors: number;
  basementFloors: number;
  latitude: number;
  longitude: number;
  buildingImageUrl: string;
};

/**
 * @file SearchBuildingDetail.tsx */
const FloorType = {
  SURFACE: 'SURFACE',
  GROUND: 'GROUND',
  BASEMENT: 'BASEMENT',
} as const;

type FloorType = (typeof FloorType)[keyof typeof FloorType];

type FloorEntityType = {
  id: number;
  floorType: FloorType;
  floorNumber: number;
  floorName: string;
  floorDesc: string | null;
  floorGlb: string;
  latitude: number;
  longitude: number;
  height: number;
  heading: number;
  buildingId: number;
};

type SearchBuildingDetailType = {
  id: number;
  buildingName: string;
  buildingDesc: string;
  address: string | null;
  buildingImageUrl: string | null;
  latitude: number;
  longitude: number;
  groundFloors: number;
  basementFloors: number;
  floors: FloorType[];
};
