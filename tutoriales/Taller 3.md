# Guia documentación + despliegue backend

## Documentación 

Para este módulo vamos a usar la librería Swagger.

Vamos a continuar usando el código de los ejercicios anteriores
* Backend de matemáticas ```https://github.com/cristianABC/taller-nestbasico/tree/main```
* Backend con typeorm Product + Product Image ```https://github.com/cristianABC/u-t-g```

Instalemos swagger para comenzar a documentar
```
npm install --save @nestjs/swagger
```
vamos al archivo main.ts a configurar nuestra documentación

```
  const config = new DocumentBuilder().
                setTitle('Products Backend')
                .setDescription('Products API')
                .setVersion('1.0')
                .build()
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
```

Revisen que no hayan errores en la terminal y en su navegador ingresen a la url y analicen el resultado
```
localhost:<port>/api
```

### Especificar nuestro servicio
Vamos a utilizar el siguiente decorador para especificar las respuestas esperadas del servicio
``` 
@Post()
  @ApiResponse({status: 201, description: 'Product was created', type: Product})
  @ApiResponse({status: 400, description: 'Bad Request'})
  @ApiResponse({status: 403, description: 'Token Expired'})
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }
```
Al decirle que el type de la respuesta es Product de nuestra entidad es necesario ir a nuestra 
entidad y especificar cuales son las propiedades que va responder el objeto

```
 @ApiProperty()
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @ApiProperty()
    @Column('text', {
        unique: true
    })
    title: string;
    
    @ApiProperty()
    @Column({
        type: 'text',
        nullable: true
    })
    description: string;
```

Ahora vamos a expandir nuestro ApiProperty para dar más detalles y ejemplos al usuario
```
@ApiProperty({
        example: '26b071e4-75f9-4897-bec8-0591804360e9',
        description: 'Product id',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;
```
De esta manera podremos dar ejemplos de uso para cada campo a nuestro usuario,
también tenemos disponible la propiedad default para especificar valores por defecto

Ahora vamos a documentar nuestros DTO
primero el que usamos para paginar pagination.dto.ts, nos vamos apoyar nuevamente de nuestro @ApiProperty
** si no ves el findAll que reciba un pagination puedes revisar el repo nuevamente en el controlador
función getAll



```
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto {
    
    @ApiProperty({
        description: 'How many rows do you need',
        default: 10
    })
    @IsOptional()
    @IsPositive()
    @Type(()=> Number)
    limit?: number;

    @ApiProperty({
        description: 'How many rows do you want to skip',
        default: 0
    })
    @IsOptional()
    @Min(0)
    @Type(()=> Number)
    offset?: number;
}
```

Ahora vamos con nuestro DTO de creación create-product.dto.ts, nuevamente usaremos nuestro decorador
@ApiProperty()

```
import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsNumber, IsOptional, IsPositive, 
    IsString, MinLength } from "class-validator";

export class CreateProductDto {

    
    @ApiProperty({
        description: 'product title (unique)',
        nullable: false,
        minLength: 1
    })
    @IsString()
    @MinLength(1)
    title: string;

    @ApiProperty()
    @IsPositive()
    @IsNumber()
    @IsOptional()
    price?: number;
    
    @ApiProperty()
    @IsOptional()
    @IsString()
    description?: string;
    
    @ApiProperty()
    @IsString({each: true})
    @IsArray()
    sizes: string[];
    
    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    active?: boolean;
    
    @ApiProperty()
    @IsString({each: true})
    @IsArray()
    @IsOptional()
    images?: string[]

}
```

Para el caso de nuestro update-product.dto.ts, es necesario reemplazar la importación de partialType 
por la de swagger

```

import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {}

```

en la documentación oficial pueden encontrar como agregar la autenticación y otros elementos a swagger

## Despliegue

# Postgres SQL en la nube

```neon.com```
Capa gratuita, sientanse libres de usar la plataforma que deseen para su proyecto

Crear proyecto luego modificar variables de entorno con la información dada dentro de la plataforma
en cloud es necesario agregar 

primero vamos agregar variable de entorno que indique el environment 
```
STAGE=prod
DB_PASSWORD=MYejo123o1289dahsdaslkl
DB_NAME=guiaBD
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
```
Luego vamos a nuestro app.module.ts, es necesario agregar seguridad para conexiones cloud en nuestro
typeOrm.forRoot
```
ssl: process.env.STAGE==='prod'?true: false,
```
al tomar las variables y configuraciones nuevas ya tendremos una conexión a la base de datos cloud,
también puede usar table plus o sus gestores para validar

# Desplegar backend en render
ingresar a ```render.com```


```add new => web service``` 
seleccionar repo en git provider y luego la rama.
 
En las configuraciones verán que el primer comando que ejecuta es el start
se debería reemplazar el nest start por 
``` 
start: "node dist/main" 
```
esto para que se ejecute a traves del compilado en node y no en nest 

escojan tier gratuito

luego add from .env y les permite copiar y pegar variables para tener el ambiente listo
si quieren generar hex para sus secrets usen en la terminal 
```openssl rand -hex 24```

click en desplegar/crear y les va retornar una URL que será la de su API
