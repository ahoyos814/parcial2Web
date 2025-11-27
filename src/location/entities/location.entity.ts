import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, ManyToMany } from 'typeorm';
import { Character } from '../../character/entities/character.entity';

@Entity()
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  name: string;

  @Column('text')
  type: string;

  @Column('decimal', {
    precision: 12,
    scale: 2,
  })
  cost: number;

  @Column()
  ownerId: number;

  @ManyToOne(() => Character, (character) => character.ownedProperties, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ownerId' })
  owner: Character;

  @ManyToMany(() => Character, (character) => character.favPlaces)
  favBy: Character[];
}