import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { Location } from './entities/location.entity';
import { Character } from '../character/entities/character.entity';
import { TokenModule } from '../token/token.module';

@Module({
  controllers: [LocationController],
  providers: [LocationService],
  imports: [
    TypeOrmModule.forFeature([Location, Character]),
    TokenModule
  ],
  exports: [LocationService, TypeOrmModule],
})
export class LocationModule {}
