type TabConst = {
  title: string;
  desc: string;
};

type SectionConst = TabConst & {
  ICON: LucideIcon;
  addActionName: string;
};

/**
 * @file SearchBuildings.tsx */
type FormSearchBuildingsType = {
  search: string;
};

type GetBuildingsType = Record<
  'id' | 'buildingName' | 'buildingDesc' | 'address' | 'buildingImage',
  string
> &
  Record<'latitude' | 'longitude', number>;

/**
 * @file BM_RightBuildingCreate.tsx */
type BM_BuildingCreateForm = {
  buildingName: string;
  buildingDesc: string;
  address: string;
  buildingImageUrl: FileList;
  groundFloor: number;
  baseFloor: number;
  latitude: number;
  longitude: number;
  presignedUrl: string;
};
