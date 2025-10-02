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
  permissions?: PermissionsType[];
};

type ValidateSessionResultType = ResResultType &
  Partial<SessionValidationResult>;

type LoginReqBodyType = {
  username: string;
  password: string;
  force?: boolean;
};

type LoginServiceParameterType = LoginReqBodyType & {
  clientSignature: string;
};
