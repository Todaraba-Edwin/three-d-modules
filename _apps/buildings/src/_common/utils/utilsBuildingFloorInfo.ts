type parameter = Record<'groundFloors' | 'basementFloors', number>;
export const utilsBuildingFloorInfo = ({
  groundFloors,
  basementFloors,
}: parameter): string => {
  if (groundFloors && !basementFloors) return `지상 ${groundFloors}층`;
  if (!groundFloors && basementFloors) return `지하 ${basementFloors}층`;
  return `지상 ${groundFloors}층 / 지하 ${basementFloors}층`;
};
