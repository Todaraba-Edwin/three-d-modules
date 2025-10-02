import { ResultDto } from '@src_apps/modules/_api';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

// ⬅️ Request // ====================================
export class CreateBuildingReqBody {
  @IsString()
  @IsNotEmpty()
  buildingName: string;

  @IsString()
  @IsOptional()
  buildingDesc?: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  groundFloors: number;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  basementFloors: number;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  latitude: number;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  longitude: number;

  @IsString()
  @IsOptional()
  buildingImageUrl?: string;
}

export class DeleteBuildingReqBody {
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  buildingId: number;
}

// ➡️ Result // ====================================
export class GetBuildingList {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  buildingName: string;

  @IsString()
  @IsNotEmpty()
  address: string;
}

export class CreateBuildingResult extends ResultDto {
  @IsNumber()
  @IsNotEmpty()
  createdBuildingId: number;
}

export class DeleteBuildingResult extends ResultDto {
  @IsNumber()
  @IsNotEmpty()
  deleteBuildingId: number;
}
