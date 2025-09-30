import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateBuildingDto {
  @IsString()
  @IsNotEmpty()
  buildingName: string;

  @IsString()
  @IsNotEmpty()
  buildingDesc: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  groundFloor: number;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  baseFloor: number;

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
  buildingImage?: string;
}
