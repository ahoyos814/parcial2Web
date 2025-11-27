import { Injectable, Logger, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Character } from './entities/character.entity';
import { CreateCharacterDto } from './dto/create-character.dto';

@Injectable()
export class CharacterService {
  private readonly logger = new Logger('CharacterService');

  constructor(
    @InjectRepository(Character)
    private readonly characterRepository: Repository<Character>,
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
          ownedProperties: true,
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
      const character = await this.findOne(characterId);
      // Por ahora solo retornamos mensaje
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
          ownedProperties: true,
        },
      });

      if (!character) {
        throw new NotFoundException(`No se encontro el personaje con id ${id}`);
      }

      if (!character.ownedProperties || character.ownedProperties.length === 0) {
        return {
          character,
          taxDebt: 0,
          message: 'El personaje no tiene propiedades, no debe impuestos',
        };
      }

      // Calcular impuestos de todas las propiedades
      let totalTaxDebt = 0;
      const details = character.ownedProperties.map(property => {
        // Fórmula: COEF = SI ES EMPLEADO 0.08 SI NO 0.03
        // COSTO_LOCATION * (1 + COEF)
        const coef = character.employee ? 0.08 : 0.03;
        const taxDebt = Number(property.cost) * (1 + coef);
        totalTaxDebt += taxDebt;
        return {
          property: property.name,
          cost: property.cost,
          taxDebt: Math.round(taxDebt * 100) / 100,
          formula: `${property.cost} * (1 + ${coef}) = ${taxDebt}`,
        };
      });

      return {
        character,
        totalTaxDebt: Math.round(totalTaxDebt * 100) / 100,
        isEmployee: character.employee,
        propertyDetails: details,
        summary: `Total de impuestos por ${details.length} propiedades`,
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
