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
