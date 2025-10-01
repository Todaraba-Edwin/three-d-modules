export class CreateUserDto {
  username: string;
  nickname: string;
  password: string;
  email: string;
  role_id: number;
}
class MenuPermissionDto {
  menu_id: number;
  menu_can_access: boolean;
}

export class UpsertRoleDto {
  role_id: number | undefined;
  role_code: string;
  role_name: string;
  role_description: string;
  menu_permissions: MenuPermissionDto[];
}
