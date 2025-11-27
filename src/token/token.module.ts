import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenService } from './token.service';
import { TokenController } from './token.controller';
import { Token } from './entities/token.entity';
import { ApiTokenGuard } from '../guards/api-token.guard';

@Module({
  controllers: [TokenController],
  providers: [TokenService, ApiTokenGuard],
  imports: [TypeOrmModule.forFeature([Token])],
  exports: [TokenService, TypeOrmModule, ApiTokenGuard], // Exportamos para uso en otros módulos
})
export class TokenModule {}
