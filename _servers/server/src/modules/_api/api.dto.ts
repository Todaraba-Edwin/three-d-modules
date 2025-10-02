import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ResultDto {
  @IsString()
  @IsNotEmpty()
  message: string;
}

export class SearchQueryStaticDto {
  @IsString()
  @IsNotEmpty()
  search: string;
}

export class SearchQueryOptionDto {
  @IsString()
  @IsOptional()
  search?: string;
}
