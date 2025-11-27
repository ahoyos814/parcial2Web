# 📚 Taller Práctico de Endpoints con NestJS

## 👨‍💻 Tema
Conceptos Fundamentales de NestJS (Módulos, Controladores, Servicios)

## 🎯 Objetivo
El objetivo de este taller es que los estudiantes demuestren la correcta separación de responsabilidades en NestJS implementando tres grupos de *endpoints* que varían en complejidad, desde fórmulas directas hasta lógica condicional y procesamiento de colecciones de datos.

---

## 🛠️ Requisitos e Inicialización

### Requisitos Previos
* Node.js y NestJS CLI instalados.
* Conocimiento de TypeScript y la estructura de NestJS.

### Configuración Inicial
1.  **Crear el proyecto:**
    ```bash
    nest new nestjs-taller-endpoints
    cd nestjs-taller-endpoints
    ```
2.  **Generar los módulos base:**
    ```bash
    nest g mo matematicas
    nest g mo fisica
    nest g mo avanzado

    o
    nest g res <modulename>
    ```
3.  **Generar los Controladores y Servicios** para cada módulo (debe hacerse individualmente, ejemplo: `nest g co matematicas`).

---

## 1. 🎯 Grupo 1: Funcionalidades de Complejidad Mediana (`matematicas`)

**Objetivo:** Practicar el manejo de **múltiples parámetros** y la implementación de **lógica intermedia** en el Servicio.

| Método HTTP | Ruta | Descripción | Datos de Entrada | Decorador a Usar |
| :---: | :--- | :--- | :--- | :--- |
| `GET` | `/matematicas/primo/:numero` | Determina si un número es primo. | `numero` (en la URL) | `@Param()` |
| `POST` | `/matematicas/fibonacci` | Calcula el N-ésimo número de Fibonacci. | `n` (en el cuerpo) | `@Body()` |
| `GET` | `/matematicas/mcd/:a/:b` | Calcula el Máximo Común Divisor (MCD). | `a`, `b` (en la URL) | `@Param()` |

**Tareas Clave:**
* Implementar la lógica del MCD (ej. algoritmo de Euclides) y la verificación de número primo en el **Servicio**.
* El Controlador debe ser una capa delgada que solo delega al Servicio.

---

## 2. 📐 Grupo 2: Fórmulas de Física (`fisica`)

**Objetivo:** Practicar el uso de **parámetros de consulta** (`@Query()`) y la aplicación simple de fórmulas.

| Método HTTP | Ruta | Descripción | Fórmula | Datos de Entrada | Decorador a Usar |
| :---: | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/fisica/velocidad` | Calcula la **velocidad media**. | $v = d / t$ | Distancia ($d$), Tiempo ($t$) | `@Query()` |
| `POST` | `/fisica/fuerza` | Calcula la Fuerza. | $F = m \cdot a$ | Masa ($m$), Aceleración ($a$) | `@Body()` |

**Tareas Clave:**
* Asegurarse de que el *endpoint* de velocidad utiliza **Query Parameters** para recibir la distancia y el tiempo.
* Implementar ambas fórmulas en el **Servicio de Física**.

---

## 3. 🚀 Grupo 3: Mayor Dificultad (`avanzado`)

**Objetivo:** Introducir complejidad con **lógica condicional**, **procesamiento de colecciones**, y uso de **DTOs**.

### A. Ecuación Cuadrática ($ax^2 + bx + c = 0$)

| Método HTTP | Ruta | Descripción |
| :---: | :--- | :--- |
| `POST` | `/avanzado/ecuacion-cuadratica` | Resuelve una ecuación cuadrática. |

**Criterios de Implementación:**
1.  **DTO:** Crear un DTO para tipar los coeficientes $a$, $b$ y $c$.
2.  **Lógica del Servicio:** Manejar los tres casos basados en el discriminante ($\Delta = b^2 - 4ac$):
    * $\Delta < 0$: No hay soluciones reales.
    * $\Delta = 0$: Una solución real ($x = -b / (2a)$).
    * $\Delta > 0$: Dos soluciones reales ($x = \frac{-b \pm \sqrt{\Delta}}{2a}$).
3.  **Respuesta:** Devolver una estructura que indique el estado y los resultados (`solucionesReales: boolean`, `resultado: any[]`).

### B. Análisis Estadístico Básico (Media, Mediana y Moda)

| Método HTTP | Ruta | Descripción |
| :---: | :--- | :--- |
| `POST` | `/avanzado/analisis-estadistico` | Calcula la media, la mediana y la moda de un conjunto de números. |

**Criterios de Implementación:**
1.  **DTO:** Crear un DTO que contenga un *array* de números (`numeros: number[]`).
2.  **Lógica del Servicio:** Implementar las tres métricas:
    * **Media ($\bar{x}$):** $$\bar{x} = \frac{\sum_{i=1}^{N} x_i}{N}$$
    * **Mediana ($M$):** Valor central del conjunto ordenado (manejar casos pares/impares).
    * **Moda:** Valor(es) con mayor frecuencia.
3.  **Respuesta:** Devolver un objeto con las tres métricas: `{ media: number, mediana: number, moda: number[] }`.

---

## ✅ Cuál feedback obtengo luego del taller ?

* **Estructura:** Uso correcto de Módulos, Controladores y Servicios.
* **Separación de Responsabilidades:** La lógica de negocio reside exclusivamente en los Servicios.
* **Manejo de Datos:** Uso correcto de `@Param()`, `@Query()` y `@Body()`.
* **Tipado:** Uso de DTOs para las peticiones más complejas.
