type BuildingCreate_ReqBodyType = {
  buildingName: string;
  address: string;
  groundFloors: number;
  basementFloors: number;
  latitude: number;
  longitude: number;
  buildingDesc?: string;
  buildingImageUrl?: string;
};
