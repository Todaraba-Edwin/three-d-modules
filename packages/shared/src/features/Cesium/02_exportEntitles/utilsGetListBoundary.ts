import type {
  GlbListType,
  utilsGetListBoundaryReturn,
} from '../05_shared/types';

export const utilsGetListBoundary = ({
  list,
}: {
  list: GlbListType[];
}): utilsGetListBoundaryReturn => {
  const lats = list.map(list => list.positions.lat);
  const long = list.map(list => list.positions.lon);

  const west = Math.min(...long);
  const east = Math.max(...long);
  const south = Math.min(...lats);
  const north = Math.max(...lats);

  const center = {
    lat: (south + north) / 2,
    lon: (west + east) / 2,
  };

  return {
    west,
    east,
    south,
    north,
    center,
  };
};
