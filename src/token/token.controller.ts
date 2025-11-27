import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TokenService } from './token.service';
import { CreateTokenDto } from './dto/create-token.dto';
import { Token } from './entities/token.entity';

@ApiTags('tokens')
@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new API token' })
  @ApiResponse({
    status: 201,
    description: 'Token was created successfully',
    type: Token,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  create(@Body() createTokenDto: CreateTokenDto) {
    return this.tokenService.create(createTokenDto);
  }

  @Get(':idToken')
  @ApiOperation({ summary: 'Check if token is active and has requests left by token string' })
  @ApiResponse({
    status: 200,
    description: 'Returns validation result',
    schema: {
      type: 'object',
      properties: {
        isValid: { type: 'boolean' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Token not found' })
  async validateToken(@Param('idToken') idToken: string) {
    const token = await this.tokenService.findByToken(idToken);
    const isValid = token.active && token.reqLeft > 0;
    return {
      isValid,
    };
  }

  @Patch('reduce/:idToken')
  @ApiOperation({ summary: 'Reduce token request count by 1 using token string' })
  @ApiResponse({
    status: 200,
    description: 'Token request count reduced successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        success: { type: 'boolean' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Token not found' })
  async reduceTokenRequests(@Param('idToken') idToken: string) {
    const token = await this.tokenService.findByToken(idToken);
    await this.tokenService.reduceTokenRequests(token.id);
    return {
      message: 'Token request count reduced successfully',
      success: true,
    };
  }
}
