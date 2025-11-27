### Taller 4 Rutas privadas y relaciones pendientes


## Proteger Rutas Aplicación con Guards

En nestJS usamos Guards para proteger las rutas teniendo en cuenta configuraciones dadas por nosotros.

Si un guard retorna true puede acceder a la ruta/endpoint

```
nest g gu guards/apiToken
```

Los guards implementan la clase CanActivate para hacer las validaciones

```
@Injectable()
export class ApiTokenGuard implements CanActivate {

    async canActivate(context:ExecutionContext):Promise<boolean> {

        const request = context.switchToHttp().getRequest();

        const apiToken = request.headers['api-token']

        // Validar Existencia de Token 

        // Validar servicio de tokens

        // Si son exitosas las validaciones retorne true

        return true;

    }


}

```

PREGUNTA: Qué falta para poder hacer peticiones a la base de datos
RESPUESTA: Agregar constructor e inyectar el repositorio de la tabla

No es suficiente definir el guard, ahora debemos importarlo. Agrega la configuración en el modulo actual. 

Si quieres usarlo en más modulo lo agregas en exports también.

```
@Module({
    ...,
    providers: [ApiTokenGuard], // usar en el módulo
    exports: [ApiTokenGuard] // usar en otros módulos
})
```

Para usarlo puedes agregar el decorador useGuards sobre la ruta
```
@UseGuards(ApiTokenGuard)
@Post()
fn(dto:dto){
    return ....
}
```
También puedes usarlo para toda la ruta 

```
@UseGuards(ApiTokenGuard)
@Controller('admin')
export class AdminController {
    ...
}
```

o puedes aplicarlo a todo tu backend en el archivo main.ts

```
const authModule = app.select(AuthModule)
const apiTokenGuard = authModule.get(ApiTokenGuard)
app.useGlobalGuards(apiTokenGuard)


```

## Relaciones pendientes

# Uno a Uno 
```
export class User {


    @OneToOne(()=> Profile, profile.user)
    @JoinColumn() //crea columna de FK a profile
    profile: Profile; 

}



export class Profile {
    ...
    @OneToOne(()=> User, user => user.profile)
    user: User;
}
```

Ejemplos Uno a Uno 
* Persona => Doc. de Identindad
* Caja de seguridad => llave
* Usuario => Perfil
* Paciente => Historia Clínica

# Muchos a Muchos 
Estas relaciones requieren tablas intermedias para poder funcionar correctamente

```
export class Student {
    
    
    @ManyToMany(()=> Course, course=> course.students)
    @JoinTable() // indica a typeorm que debe crear tabla //intermedia
    courses: Course[];
}

export class Course {
    @ManyToMany(()=> Student, student => student.courses)
    students: Student[];
}
```

Ejemplos Muchos a Muchos
* Idioma => Libro
* Ingrediente => Receta
* Actor => Pelicula 
* Producto => Orden
