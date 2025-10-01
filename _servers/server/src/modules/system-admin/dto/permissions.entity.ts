export class MenuPermissionDto {
  menu_id: number;
  menu_label: string;
  menu_can_access: boolean;
}

export class PermissionsByRoleResDto {
  role_id: number;
  role_code: string;
  role_name: string;
  role_description: string;
  permissionMenu: MenuPermissionDto[];
}
