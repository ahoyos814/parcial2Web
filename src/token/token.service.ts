import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Token } from './entities/token.entity';
import { CreateTokenDto } from './dto/create-token.dto';

@Injectable()
export class TokenService {
  private readonly logger = new Logger('TokenService');

  constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
  ) {}

  async create(createTokenDto: CreateTokenDto) {
    try {
      const token = this.tokenRepository.create(createTokenDto);
      await this.tokenRepository.save(token);
      return token;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async validateToken(tokenString: string): Promise<Token> {
    try {
      const token = await this.tokenRepository.findOneBy({
        token: tokenString,
        active: true,
      });

      if (!token) {
        throw new NotFoundException(
          `Token ${tokenString} not found or inactive`,
        );
      }

      if (token.reqLeft <= 0) {
        throw new BadRequestException(
          `Token ${tokenString} has no requests left`,
        );
      }

      return token;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findById(id: string): Promise<Token> {
    try {
      const token = await this.tokenRepository.findOneBy({
        id: id,
      });

      if (!token) {
        throw new NotFoundException(`Token with id ${id} not found`);
      }

      return token;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findByToken(tokenString: string): Promise<Token> {
    try {
      const token = await this.tokenRepository.findOneBy({
        token: tokenString,
      });

      if (!token) {
        throw new NotFoundException(`Token ${tokenString} not found`);
      }

      return token;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async reduceTokenRequests(tokenId: string): Promise<void> {
    try {
      const token = await this.tokenRepository.findOneBy({ id: tokenId });

      if (!token) {
        throw new NotFoundException(`Token with id ${tokenId} not found`);
      }

      if (token.reqLeft > 0) {
        token.reqLeft -= 1;
        await this.tokenRepository.save(token);
      }
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  private handleDBExceptions(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
