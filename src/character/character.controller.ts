import { Controller, Get, Post, Body, Patch, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiSecurity } from '@nestjs/swagger';
import { CharacterService } from './character.service';
import { CreateCharacterDto } from './dto/create-character.dto';
import { ApiTokenGuard } from '../guards/api-token.guard';

@ApiTags('characters')
@ApiSecurity('token')
@UseGuards(ApiTokenGuard)
@Controller('character')
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

  @Post()
  create(@Body() createCharacterDto: CreateCharacterDto) {
    return this.characterService.create(createCharacterDto);
  }

  @Patch(':id/favorites/:locationId')
  addFavoritePlace(
    @Param('id', ParseIntPipe) characterId: number,
    @Param('locationId', ParseIntPipe) locationId: number,
  ) {
    return this.characterService.addFavoritePlace(characterId, locationId);
  }

  @Get(':id/taxes')
  calculateTaxes(@Param('id', ParseIntPipe) id: number) {
    return this.characterService.calculateTaxes(id);
  }
}
