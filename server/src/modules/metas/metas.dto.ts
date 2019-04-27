import { IsString, IsNotEmpty } from 'class-validator';

export class MetasDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  slug: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}