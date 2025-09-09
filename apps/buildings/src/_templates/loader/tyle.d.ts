type PermissionsType = {
  id: number;
  label: string;
  icon_name: string;
  parent_id: number | null;
  path: string;
  can_access: boolean;
  sort_order: number;
};

type CheckAuthType = Promise<{
  message: string;
  nickname: string;
  roleCode: string;
  permissions: PermissionsType[];
} | null>;

type RouteLoaderType = Promise<Response | null>;
