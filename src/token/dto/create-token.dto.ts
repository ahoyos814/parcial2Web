import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, MinLength, IsNumber, IsPositive } from 'class-validator';

export class CreateTokenDto {
  @ApiProperty({
    example: 'abc123def456ghi789jkl012',
    description: 'API Token string (unique)',
    nullable: false,
    minLength: 10,
  })
  @IsString()
  @MinLength(10)
  token: string;

  @ApiProperty({
    example: true,
    description: 'Token status - true if active, false if deactivated',
    default: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @ApiProperty({
    example: 50,
    description: 'Number of API requests remaining for this token',
    default: 10,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  reqLeft?: number;
}