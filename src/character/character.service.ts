import { Injectable, Logger, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Character } from './entities/character.entity';
import { Location } from '../location/entities/location.entity';
import { CreateCharacterDto } from './dto/create-character.dto';

@Injectable()
export class CharacterService {
  private readonly logger = new Logger('CharacterService');

  constructor(
    @InjectRepository(Character)
    private readonly characterRepository: Repository<Character>,
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {}

  async create(createCharacterDto: CreateCharacterDto) {
    try {
      const character = this.characterRepository.create(createCharacterDto);
      await this.characterRepository.save(character);
      return character;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findOne(id: number) {
    try {
      const character = await this.characterRepository.findOne({
        where: { id },
        relations: {
          property: true,
          favPlaces: true,
        },
      });

      if (!character) {
        throw new NotFoundException(`Character with id ${id} not found`);
      }

      return character;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async addFavoritePlace(characterId: number, locationId: number) {
    try {
      // Buscar el personaje con sus lugares favoritos actuales
      const character = await this.characterRepository.findOne({
        where: { id: characterId },
        relations: ['favPlaces'],
      });
      
      if (!character) {
        throw new NotFoundException(`Personaje con ID ${characterId} no encontrado`);
      }

      // Buscar la ubicación
      const location = await this.locationRepository.findOne({
        where: { id: locationId },
      });
      
      if (!location) {
        throw new NotFoundException(`Ubicación con ID ${locationId} no encontrada`);
      }

      // Verificar si ya está en favoritos
      const isAlreadyFavorite = character.favPlaces.some(place => place.id === locationId);
      if (isAlreadyFavorite) {
        return {
          message: `La ubicación ${locationId} ya está en los favoritos del personaje ${characterId}`,
          success: false,
        };
      }

      // Agregar la ubicación a favoritos
      character.favPlaces.push(location);
      await this.characterRepository.save(character);

      return {
        message: `Se agrego la locacion ${locationId} como favorita del personaje ${characterId}`,
        success: true,
      };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async calculateTaxes(id: number) {
    try {
      const character = await this.characterRepository.findOne({
        where: { id },
        relations: {
          property: true,
        },
      });

      if (!character) {
        throw new NotFoundException(`No se encontro el personaje con id ${id}`);
      }

      if (!character.property || character.property.length === 0) {
        return {
          totalTaxDebt: 0,
        };
      }

      // Calcular impuestos de todas las propiedades
      let totalTaxDebt = 0;
      character.property.forEach(property => {
        // Fórmula: COEF = SI ES EMPLEADO 0.08 SI NO 0.03
        // COSTO_LOCATION * (1 + COEF)
        const coef = character.employee ? 0.08 : 0.03;
        const taxDebt = Number(property.cost) * (1 + coef);
        totalTaxDebt += taxDebt;
      });

      return {
        totalTaxDebt: Math.round(totalTaxDebt * 100) / 100,
      };
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
