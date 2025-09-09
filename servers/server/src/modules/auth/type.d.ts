type PermissionsType = {
  id: number;
  label: string;
  icon_name: string;
  parent_id: number | null;
  path: string;
  can_access: boolean;
  sort_order: number;
};
