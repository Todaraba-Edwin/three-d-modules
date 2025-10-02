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

export class LoginReqDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsBoolean()
  @IsOptional()
  force?: boolean;
}

// =================================
// ➡️ Result DTOs
// =================================

export class LoginResDto {
  result: ResultDto;
  sessionId: string;
}

export class PermissionsDto {
  @IsNumber()
  id: number;

  @IsString()
  label: string;

  @IsString()
  icon_name: string;

  @IsNumber()
  @IsOptional()
  parent_id: number | null;

  @IsString()
  path: string;

  @IsBoolean()
  can_access: boolean;

  @IsNumber()
  sort_order: number;
}

export class ValidateSessionResultDto extends ResultDto {
  @IsString()
  @IsOptional()
  roleCode?: string;

  @IsString()
  @IsOptional()
  nickname?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PermissionsDto)
  @IsOptional()
  permissions?: PermissionsDto[];
}

// =================================
// ⚙️ Service-internal Types
// =================================

export class LoginServiceParams extends LoginReqDto {
  @IsString()
  @IsNotEmpty()
  clientSignature: string;
}

export class SessionValidationInternalResult extends ValidateSessionResultDto {
  @IsBoolean()
  isValid: boolean;
}
