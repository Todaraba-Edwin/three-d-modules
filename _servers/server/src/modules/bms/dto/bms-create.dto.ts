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
