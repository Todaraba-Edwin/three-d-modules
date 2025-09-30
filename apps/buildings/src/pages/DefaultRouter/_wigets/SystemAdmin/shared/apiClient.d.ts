type BuildingCreate_ReqBodyType = {
  buildingName: string;
  address: string;
  groundFloor: number;
  baseFloor: number;
  latitude: number;
  longitude: number;
  buildingDesc?: string;
  buildingImage?: string;
};
