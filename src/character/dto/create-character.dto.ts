import { IsString, IsNumber, IsPositive, IsBoolean, MinLength } from 'class-validator';

export class CreateCharacterDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsNumber()
  @IsPositive()
  salary: number;

  @IsBoolean()
  employee: boolean;
}