import { Injectable, Logger, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './entities/location.entity';
import { Character } from '../character/entities/character.entity';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

@Injectable()
export class LocationService {
  private readonly logger = new Logger('LocationService');

  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
    @InjectRepository(Character)
    private readonly characterRepository: Repository<Character>,
  ) {}

  async create(createLocationDto: CreateLocationDto) {
    try {
      // Validar que el dueño exista
      const owner = await this.characterRepository.findOne({
        where: { id: createLocationDto.ownerId }
      });

      if (!owner) {
        throw new NotFoundException(`El personaje con id ${createLocationDto.ownerId} no existe. El dueño debe existir.`);
      }

      const location = this.locationRepository.create(createLocationDto);
      await this.locationRepository.save(location);
      return location;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll() {
    try {
      return await this.locationRepository.find({
        relations: {
          owner: true,
          favCharacters: true,
        },
      });
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findOne(id: number) {
    try {
      const location = await this.locationRepository.findOne({
        where: { id },
        relations: {
          owner: true,
          favCharacters: true,
        },
      });

      if (!location) {
        throw new NotFoundException(`Location with id ${id} not found`);
      }

      return location;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async update(id: number, updateLocationDto: UpdateLocationDto) {
    try {
      const location = await this.findOne(id);
      Object.assign(location, updateLocationDto);
      await this.locationRepository.save(location);
      return location;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: number) {
    try {
      const location = await this.findOne(id);
      await this.locationRepository.remove(location);
      return { message: `Location with id ${id} has been removed` };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  private handleDBExceptions(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
