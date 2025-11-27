import { Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Location } from '../../location/entities/location.entity';

@Entity()
export class Character {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  name: string;

  @Column('decimal', {
    precision: 10,
    scale: 2,
  })
  salary: number;

  @Column('bool')
  employee: boolean;

  @OneToMany(() => Location, (location) => location.owner)
  ownedProperties: Location[];

  @ManyToMany(() => Location, (location) => location.favBy)
  @JoinTable({
    name: 'character_favorites',
    joinColumn: {
      name: 'character_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'location_id',
      referencedColumnName: 'id',
    },
  })
  favPlaces: Location[];
}