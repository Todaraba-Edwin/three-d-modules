type PermissionsType = {
  id: number;
  label: string;
  icon_name: string;
  parent_id: number | null;
  path: string;
  can_access: boolean;
  sort_order: number;
};

type SessionValidationResult = {
  isValid: boolean;
  roleCode?: string;
  username?: string;
  nickname?: string;
  message?: string;
  permissions?: PermissionsType[]; // 실제 PermissionsType으로 교체하는 것이 좋습니다.
};
