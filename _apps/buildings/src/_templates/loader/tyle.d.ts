type PermissionsType = {
  id: number;
  label: string;
  icon_name: string;
  parent_id: number | null;
  path: string;
  can_access: boolean;
  sort_order: number;
};

type CheckAuthResultType = {
  message: string;
  nickname: string;
  permissions: permissionsType[];
  roleCode: string;
};

type utilsCheckAuthType = Promise<CheckAuthResultType | null>;
type RouteLoaderType = Promise<Response | void>;
