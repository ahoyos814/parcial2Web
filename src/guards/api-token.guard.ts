import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenService } from '../token/token.service';

@Injectable()
export class ApiTokenGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // Buscar el token en diferentes headers para flexibilidad
    const apiToken = request.headers['token'] || request.headers['api-token'];

    if (!apiToken) {
      throw new UnauthorizedException('Se requiere token de API');
    }

    try {
      // Validar si el token existe, está activo y tiene requests disponibles
      const token = await this.tokenService.validateToken(apiToken);
      
      // Reducir el contador de requests
      await this.tokenService.reduceTokenRequests(token.id);
      
      // Agregar el token al request para uso posterior si es necesario
      request.token = token;
      
      return true;
    } catch (error) {
      throw new UnauthorizedException('Token de API invalido o vencido');
    }
  }
}