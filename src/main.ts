import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configurar para aceptar JSON por defecto
  app.use((req, res, next) => {
    if (!req.headers['content-type'] && req.method !== 'GET') {
      req.headers['content-type'] = 'application/json';
    }
    next();
  });

  app.useGlobalPipes(
    new ValidationPipe(
      {
        whitelist: true,
        forbidNonWhitelisted: true
      }
    )
  )

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Sistema de Impuestos Springfield')
    .setDescription('API para manejar personajes, propiedades y calcular impuestos')
    .setVersion('1.0')
    .addApiKey({
      type: 'apiKey',
      name: 'token',
      in: 'header',
    }, 'token')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
