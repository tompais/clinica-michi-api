# 🐾 clinica-michi-api

La API de la Clínica Veterinaria Michi: el código de ejemplo del **Michi Dev Quest**. Todo lo que se ve en el juego está acá, armado como en un proyecto real: NestJS sobre Bun, arquitectura hexagonal con DDD, TypeORM con Postgres, Vitest y los workflows de GitHub Actions del equipo.

## Levantarlo en tu compu

### Opción 1: con Docker (Postgres de verdad)

```bash
docker compose up
```

Levanta un Postgres y la API. La API corre las migraciones y carga datos de ejemplo sola. Cuando aparezca `🐾 API lista`, abrí http://localhost:3000/gatos.

### Opción 2: sin Docker (base en memoria)

```bash
bun install
bun run start:dev
```

Si no hay `DATABASE_URL`, la API usa un Postgres en memoria ([PGlite](https://pglite.dev)). No hay que instalar nada más. Arranca vacío, corre las migraciones, carga los datos de ejemplo y se borra al apagar.

### Probar los pedidos

[`ejemplos.http`](ejemplos.http) es un archivo con pedidos HTTP listos para mandar a la API desde el editor, sin Postman ni curl. Sirve para ver cómo responde cada endpoint y para probar a mano un cambio antes de abrir el PR.

1. Levantá la API (`bun run start:dev`) y esperá a ver `🐾 API lista`.
2. Abrí `ejemplos.http`. WebStorm lo entiende solo. En VS Code hace falta la extensión REST Client.
3. Tocá ▶ al lado del pedido que quieras. La respuesta aparece en un panel, con el código (200, 201, 400, 422) y el JSON.

Trae un pedido por cada caso: ver gatos, filtrar los que están en adopción, crear un dueño y un gato, reservar un turno, los errores 400 y 422, adoptar a Copito y dar de baja a un dueño. Cada `###` separa un pedido y `@base` guarda la dirección de la API.

## Comandos

| Comando                     | Qué hace                                                               |
| --------------------------- | ---------------------------------------------------------------------- |
| `bun run start:dev`         | Levanta la API y la reinicia cuando guardás un cambio                  |
| `bun run test`              | Corre todos los tests con Vitest                                       |
| `bun run test:coverage`     | Corre los tests y falla si la cobertura baja de 80%                    |
| `bun run lint`              | Formato y lint con Biome. `bun run lint:fix` arregla lo que puede solo |
| `bun run typecheck`         | Revisa que compile, con `tsc`                                          |
| `bun run knip`              | Busca archivos, exports y dependencias que nadie usa                   |
| `bun run job:recordatorios` | Corre el job de recordatorios una vez y termina                        |
| `bun run migration:run`     | Corre las migraciones pendientes contra `DATABASE_URL`                 |

### Lo que te frena antes de subir algo

Husky corre chequeos solo, con los hooks de git de [`.husky/`](.husky):

- **pre-commit**: Biome revisa los archivos que estás por commitear.
- **pre-push**: lint, `tsc` y Knip. Si algo falla, el push no sale.

El CI corre lo mismo y además los tests con cobertura. Si pasa en tu compu, pasa en el CI.

## Cómo está ordenado

Cada módulo sigue la arquitectura hexagonal y tiene las mismas tres carpetas:

```
src/<módulo>/
├── dominio/            Entidades inmutables, sus reglas y los puertos (interfaces + Symbol)
├── aplicacion/         Los casos de uso: un archivo por cosa que hace la clínica
├── infraestructura/    Los adaptadores: http (controllers, RequestBody, Query y Response), persistencia (entities y repos)
└── <módulo>.module.ts  Conecta cada puerto con su adaptador
```

| Módulo                                | Qué hace                                                            |
| ------------------------------------- | ------------------------------------------------------------------- |
| [`pacientes/`](src/pacientes)         | Dueños y gatos. Alta, listado y baja lógica                         |
| [`turnos/`](src/turnos)               | Reservar y cancelar turnos, con sus reglas                          |
| [`adopciones/`](src/adopciones)       | Una transacción con FOR UPDATE y un evento a Pub/Sub                |
| [`recordatorios/`](src/recordatorios) | El job que corre todos los días a las 9                             |
| [`shared/`](src/shared)               | Errores del dominio, base de datos, configuración HTTP y mensajería |

La regla de oro: `dominio` no importa nada de Nest, TypeORM ni HTTP. Las flechas van siempre hacia adentro.

### El viaje de `POST /turnos`

1. [`TurnosController`](src/turnos/infraestructura/http/turnos.controller.ts) recibe el pedido. El [`ReservarTurnoRequestBody`](src/turnos/infraestructura/http/reservar-turno.request-body.ts) lo valida.
2. Llama a [`ReservarTurnoCasoDeUso`](src/turnos/aplicacion/reservar-turno.caso-de-uso.ts), que pide tres puertos por su Symbol: `TURNO_REPOSITORY`, `GATO_REPOSITORY` y `AVISADOR`.
3. La entidad [`Turno`](src/turnos/dominio/turno.ts) aplica sus reglas: no se reserva en el pasado.
4. [`turnos.module.ts`](src/turnos/turnos.module.ts) decide quién ocupa cada puerto: `TurnoRepository` guarda en Postgres y `MailAvisador` avisa al dueño.
5. El controller devuelve un [`TurnoResponse`](src/turnos/infraestructura/http/turno.response.ts).

## Del juego al código

| Mundo del Michi Dev Quest                                         | Dónde mirarlo                                                                                                                                          |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| La clínica web: endpoints, verbos y JSON                          | [`ejemplos.http`](ejemplos.http)                                                                                                                       |
| TypeScript y código prolijo: enum con textos, valores por defecto | [`estado-turno.ts`](src/turnos/dominio/estado-turno.ts), [`crear-gato.request-body.ts`](src/pacientes/infraestructura/http/crear-gato.request-body.ts) |
| Node, Bun y las promesas                                          | [`main.ts`](src/main.ts), [`Dockerfile`](Dockerfile), [`package.json`](package.json)                                                                   |
| NestJS: controller, caso de uso y module                          | [`gatos.controller.ts`](src/pacientes/infraestructura/http/gatos.controller.ts), [`pacientes.module.ts`](src/pacientes/pacientes.module.ts)            |
| Arquitectura: hexagonal y DDD                                     | [`turnos/`](src/turnos) completo                                                                                                                       |
| Módulos e inyección                                               | [`turnos.module.ts`](src/turnos/turnos.module.ts), [`mensajeria.module.ts`](src/shared/mensajeria/mensajeria.module.ts)                                |
| Interfaces en Nest con Symbol                                     | [`turno.repository.ts`](src/turnos/dominio/turno.repository.ts), [`avisador.ts`](src/turnos/dominio/avisador.ts)                                       |
| Testing con Vitest                                                | [`test/`](test)                                                                                                                                        |
| Bases de datos: claves, ON DELETE, borrado lógico y migraciones   | [`migrations/`](src/shared/infraestructura/database/migrations), [`duenio.entity.ts`](src/pacientes/infraestructura/persistencia/duenio.entity.ts)     |
| SQL: transacciones y FOR UPDATE                                   | [`adopcion.repository.ts`](src/adopciones/infraestructura/persistencia/adopcion.repository.ts)                                                         |
| Docker y Cloud Run                                                | [`Dockerfile`](Dockerfile), [`docker-compose.yml`](docker-compose.yml)                                                                                 |
| Mensajes y jobs: Pub/Sub y cron                                   | [`mensajeria/`](src/shared/mensajeria), [`enviar-recordatorios.caso-de-uso.ts`](src/recordatorios/aplicacion/enviar-recordatorios.caso-de-uso.ts)      |
| Del PR a producción                                               | [`.github/workflows/`](.github/workflows)                                                                                                              |

## Los tests

Seguimos el testing trophy: la mayoría son de integración y los unitarios quedan para reglas con bordes finos.

- `*.integration.test.ts` levanta la app entera con la base en memoria y le pega por HTTP. Solo se reemplazan el mail y Pub/Sub, que salen del sistema. Ejemplo: [`turnos.integration.test.ts`](test/turnos.integration.test.ts).
- `*.test.ts` es unitario. Hay uno solo, para la regla de las 2 horas para cancelar: [`turno.test.ts`](test/turno.test.ts).
- [`test/support/`](test/support) arma la app de prueba, deja la base limpia antes de cada test y trae los pedidos que se repiten.
- Todos siguen AAA: Arrange, Act y Assert, marcados con un comentario.

## Los workflows

Se llaman igual que en el equipo y piden los mismos campos.

| Workflow                              | Cuándo corre                     | En este repo                                                                                                                           |
| ------------------------------------- | -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| **CI**                                | En cada push                     | Real: revisa lint, tipos y código sin usar, corre los tests con cobertura y sube la imagen al registry de GitHub con el SHA del commit |
| **CI Release**                        | A mano, con patch, minor o major | Real: toma el último main con el CI en verde, crea el tag y el release, y le pone la versión a la imagen                               |
| **CI - Deploy**                       | A mano                           | Simulado: valida los datos y muestra qué desplegaría, all-in                                                                           |
| **CI - Deploy (canary / blue-green)** | A mano                           | Simulado: muestra cómo se repartiría el tráfico                                                                                        |
| **Migrate**                           | A mano                           | Simulado: muestra qué migraciones correría                                                                                             |

Los deploys y el migrate son simulados porque este repo no tiene una nube de verdad atrás. En el equipo, esos pasos despliegan en Cloud Run y corren las migraciones contra la base de cada ambiente.

## Convenciones

- Hexagonal: el dominio no conoce a Nest ni a TypeORM. Los puertos son interfaces con su Symbol.
- Entidades del dominio inmutables: cambiar algo devuelve una instancia nueva (`turno.cancelar(ahora)`).
- Entidades de base en archivos `*.entity.ts`, con nombre `GatoEntity`. Un mapper traduce entre las dos.
- Repositorios tipados: `Repository<GatoEntity>`. Nada de SQL suelto en el código de la app.
- El puerto lleva la `I` y el adaptador no: `ITurnoRepository` en `dominio/`, `TurnoRepository` en `infraestructura/persistencia/`.
- Nada de tipos ni objetos anónimos: siempre una clase o una interfaz con nombre, como el evento `AdopcionRegistrada` o `ErrorResponse`. Lo que entra y sale por HTTP es una clase con su sufijo. `CrearGatoRequestBody` para el cuerpo, `ListarGatosQuery` para los query params y `GatoResponse` para lo que vuelve. El archivo lleva el mismo sufijo: `crear-gato.request-body.ts`.
- Interfaces solo para contratos con métodos, como los puertos, y con el prefijo `I`: `ITurnoRepository`, `IAvisador`.
- Datos que comparten varias clases: una clase abstracta. `Turno` extiende [`DatosDeTurno`](src/turnos/dominio/turno.ts) y el evento `AdopcionRegistrada` extiende `EventoDeDominio`.
- Valores por defecto en vez de `undefined`. Los pocos `null` tienen un comentario que dice qué significan.
- `enum` con textos para valores finitos, como `EstadoTurno` o `Topico`.
- Biome para formato y lint, Knip para lo que sobra y cobertura mínima de 80%.
- SOLID, KISS, DRY y YAGNI: clases chicas con una sola tarea, nada que no se use todavía. Lo que se repite va a un solo lugar, como [`fechas.ts`](src/shared/dominio/fechas.ts) o [`test/support/`](test/support).
- Ramas con su tipo adelante (`feature/`, `fix/`, `refactor/`) y commits con Conventional Commits.
