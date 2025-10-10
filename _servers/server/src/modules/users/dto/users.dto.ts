import { ResultDto } from '@src_apps/modules/_api';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { DeleteResult } from 'typeorm';
import { USER_TC_ROLES, USER_TN_USERS } from '../entities';

// =================================
// ⬅️ Request DTOs
// =================================

export class CreateUserReqDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  nickname: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  password: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNumber()
  @IsNotEmpty()
  role_id: number;
}

export class UpdateUserReqDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  nickname?: string;

  @IsString()
  @IsOptional()
  @MinLength(4)
  password?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsNumber()
  @IsOptional()
  role_id?: number;
}

class MenuPermissionDto {
  @IsNumber()
  @IsNotEmpty()
  menu_id: number;

  @IsBoolean()
  @IsNotEmpty()
  menu_can_access: boolean;
}

export class UpsertRoleReqDto {
  @IsNumber()
  @IsOptional()
  role_id: number | undefined;

  @IsString()
  @IsNotEmpty()
  role_code: string;

  @IsString()
  @IsNotEmpty()
  role_name: string;

  @IsString()
  @IsOptional()
  role_description: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MenuPermissionDto)
  menu_permissions: MenuPermissionDto[];
}

export class DeleteUsersReqDto {
  @IsArray()
  @IsNumber({}, { each: true })
  @IsNotEmpty()
  userIds: number[];
}

export class CheckUsernameReqDto {
  @IsString()
  @IsNotEmpty()
  username: string;
}

export class CheckEmailReqDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

// =================================
// ➡️ Result DTOs
// =================================

export class UserDto implements Omit<USER_TN_USERS, 'password'> {
  @IsNumber()
  id: number;

  @IsString()
  username: string;

  @IsString()
  nickname: string;

  @IsString()
  email: string;

  @IsNumber()
  role_id: number;

  @Type(() => Date)
  created_at: Date;

  @Type(() => Date)
  updated_at: Date;

  @Type(() => Date)
  last_login_at: Date;
}

export class UserWithRoleDto extends UserDto {
  @IsString()
  role_code: string;

  @IsString()
  role_name: string;
}

export class FindAllUsersResultDto extends ResultDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UserWithRoleDto)
  data: UserWithRoleDto[];
}

export class CreateUserResultDto extends ResultDto {
  @Type(() => UserDto)
  data: UserDto;
}

export class UpdateUserResultDto extends ResultDto {
  @Type(() => UserDto)
  data: UserDto;
}

export class UpsertRoleResultDto extends ResultDto {
  @Type(() => USER_TC_ROLES)
  data: USER_TC_ROLES;
}

export class DeleteUsersResultDto extends ResultDto {
  @Type(() => DeleteResult)
  data: DeleteResult;
}
