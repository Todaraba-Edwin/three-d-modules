import { ResultDto } from '@src_apps/modules/_api';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

// =================================
// ⬅️ Request DTOs
// =================================

export class DeleteRolesReqDto {
  @IsArray()
  @IsNumber({}, { each: true })
  @IsNotEmpty()
  roleIds: number[];

  @IsBoolean()
  @IsOptional()
  force?: boolean;
}

// =================================
// ➡️ Result DTOs
// =================================

class SummaryResDto {
  @IsNumber()
  usersCount: number;

  @IsNumber()
  switchModelsCount: number;

  @IsNumber()
  switchesCount: number;

  @IsNumber()
  devicesCount: number;

  @IsNumber()
  manufacturersCount: number;
}

export class MenuPermissionDto {
  @IsNumber()
  menu_id: number;

  @IsString()
  menu_label: string;

  @IsBoolean()
  menu_can_access: boolean;
}

export class SummaryResult extends ResultDto {
  data: SummaryResDto;
}

export class PermissionsByRoleResDto {
  @IsNumber()
  role_id: number;

  @IsString()
  role_code: string;

  @IsString()
  role_name: string;

  @IsString()
  role_description: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MenuPermissionDto)
  permissionMenu: MenuPermissionDto[];
}
