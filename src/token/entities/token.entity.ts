import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Token {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Token unique identifier',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'abc123def456ghi789jkl012',
    description: 'API Token string',
    uniqueItems: true,
  })
  @Column('text', {
    unique: true,
  })
  token: string;

  @ApiProperty({
    example: true,
    description: 'Token status - true si esta activo, false si esta desactivado',
    default: true,
  })
  @Column('bool', {
    default: true,
  })
  active: boolean;

  @ApiProperty({
    example: 10,
    description: 'Number of API requests remaining for this token',
    default: 10,
  })
  @Column('int', {
    default: 10,
  })
  reqLeft: number;
}