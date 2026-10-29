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

Abrí [`ejemplos.http`](ejemplos.http) en WebStorm o en VS Code (extensión REST Client) y tocá ▶ en cada pedido: ver gatos, crear un dueño, reservar un turno, adoptar a Copito y dar de baja a un dueño.

## Comandos

| Comando | Qué hace |
|---|---|
| `bun run start:dev` | Levanta la API y la reinicia cuando guardás un cambio |
| `bun run test` | Corre todos los tests con Vitest |
| `bun run typecheck` | Revisa los tipos de TypeScript |
| `bun run job:recordatorios` | Corre el job de recordatorios una vez y termina |
| `bun run migration:run` | Corre las migraciones pendientes contra `DATABASE_URL` |

## Cómo está ordenado

Cada módulo sigue la arquitectura hexagonal y tiene las mismas tres carpetas:

```
src/<módulo>/
├── dominio/            Entidades inmutables, sus reglas y los puertos (interfaces + Symbol)
├── aplicacion/         Los casos de uso: un archivo por cosa que hace la clínica
├── infraestructura/    Los adaptadores: http (controllers y DTOs), persistencia (entities y repos)
└── <módulo>.module.ts  Conecta cada puerto con su adaptador
```

| Módulo | Qué hace |
|---|---|
| [`pacientes/`](src/pacientes) | Dueños y gatos. Alta, listado y baja lógica |
| [`turnos/`](src/turnos) | Reservar y cancelar turnos, con sus reglas |
| [`adopciones/`](src/adopciones) | Una transacción con FOR UPDATE y un evento a Pub/Sub |
| [`recordatorios/`](src/recordatorios) | El job que corre todos los días a las 9 |
| [`shared/`](src/shared) | Errores del dominio, base de datos, configuración HTTP y mensajería |

La regla de oro: `dominio` no importa nada de Nest, TypeORM ni HTTP. Las flechas van siempre hacia adentro.

### El viaje de `POST /turnos`

1. [`TurnosController`](src/turnos/infraestructura/http/turnos.controller.ts) recibe el pedido. El [`ReservarTurnoDto`](src/turnos/infraestructura/http/dto/reservar-turno.dto.ts) lo valida.
2. Llama a [`ReservarTurnoCasoDeUso`](src/turnos/aplicacion/reservar-turno.caso-de-uso.ts), que pide tres puertos por su Symbol: `TURNO_REPOSITORY`, `GATO_REPOSITORY` y `AVISADOR`.
3. La entidad [`Turno`](src/turnos/dominio/turno.ts) aplica sus reglas: no se reserva en el pasado.
4. [`turnos.module.ts`](src/turnos/turnos.module.ts) decide quién ocupa cada puerto: `TypeOrmTurnoRepository` guarda en Postgres y `MailAvisador` avisa al dueño.
5. El controller devuelve un [`TurnoRespuestaDto`](src/turnos/infraestructura/http/dto/turno-respuesta.dto.ts).

## Del juego al código

| Mundo del Michi Dev Quest | Dónde mirarlo |
|---|---|
| La clínica web: endpoints, verbos y JSON | [`ejemplos.http`](ejemplos.http) |
| TypeScript y código prolijo: enum con textos, valores por defecto | [`estado-turno.ts`](src/turnos/dominio/estado-turno.ts), [`crear-gato.dto.ts`](src/pacientes/infraestructura/http/dto/crear-gato.dto.ts) |
| Node, Bun y las promesas | [`main.ts`](src/main.ts), [`Dockerfile`](Dockerfile), [`package.json`](package.json) |
| NestJS: controller, caso de uso y module | [`gatos.controller.ts`](src/pacientes/infraestructura/http/gatos.controller.ts), [`pacientes.module.ts`](src/pacientes/pacientes.module.ts) |
| Arquitectura: hexagonal y DDD | [`turnos/`](src/turnos) completo |
| Módulos e inyección | [`turnos.module.ts`](src/turnos/turnos.module.ts), [`mensajeria.module.ts`](src/shared/mensajeria/mensajeria.module.ts) |
| Interfaces en Nest con Symbol | [`turno.repository.ts`](src/turnos/dominio/turno.repository.ts), [`avisador.ts`](src/turnos/dominio/avisador.ts) |
| Testing con Vitest | [`test/`](test) |
| Bases de datos: claves, ON DELETE, borrado lógico y migraciones | [`migrations/`](src/shared/infraestructura/database/migrations), [`duenio.entity.ts`](src/pacientes/infraestructura/persistencia/duenio.entity.ts) |
| SQL: transacciones y FOR UPDATE | [`typeorm-adopcion.repository.ts`](src/adopciones/infraestructura/persistencia/typeorm-adopcion.repository.ts) |
| Docker y Cloud Run | [`Dockerfile`](Dockerfile), [`docker-compose.yml`](docker-compose.yml) |
| Mensajes y jobs: Pub/Sub y cron | [`mensajeria/`](src/shared/mensajeria), [`enviar-recordatorios.caso-de-uso.ts`](src/recordatorios/aplicacion/enviar-recordatorios.caso-de-uso.ts) |
| Del PR a producción | [`.github/workflows/`](.github/workflows) |

## Los tests

Seguimos el testing trophy: la mayoría son de integración y los unitarios quedan para reglas con bordes finos.

- `*.integration.test.ts` levanta la app entera con la base en memoria y le pega por HTTP. Solo se reemplazan el mail y Pub/Sub, que salen del sistema. Ejemplo: [`turnos.integration.test.ts`](test/turnos.integration.test.ts).
- `*.test.ts` es unitario. Hay uno solo, para la regla de las 2 horas para cancelar: [`turno.test.ts`](test/turno.test.ts).
- [`test/support/`](test/support) arma la app de prueba y deja la base limpia antes de cada test.
- Todos siguen AAA: Arrange, Act y Assert, marcados con un comentario.

## Los workflows

Se llaman igual que en el equipo y piden los mismos campos.

| Workflow | Cuándo corre | En este repo |
|---|---|---|
| **CI** | En cada push | Real: revisa tipos, corre los tests y sube la imagen al registry de GitHub con el SHA del commit |
| **CI Release** | A mano, con patch, minor o major | Real: toma el último main con el CI en verde, crea el tag y el release, y le pone la versión a la imagen |
| **CI - Deploy** | A mano | Simulado: valida los datos y muestra qué desplegaría, all-in |
| **CI - Deploy (canary / blue-green)** | A mano | Simulado: muestra cómo se repartiría el tráfico |
| **Migrate** | A mano | Simulado: muestra qué migraciones correría |

Los deploys y el migrate son simulados porque este repo no tiene una nube de verdad atrás. En el equipo, esos pasos despliegan en Cloud Run y corren las migraciones contra la base de cada ambiente.

## Convenciones

- Hexagonal: el dominio no conoce a Nest ni a TypeORM. Los puertos son interfaces con su Symbol.
- Entidades del dominio inmutables: cambiar algo devuelve una instancia nueva (`turno.cancelar(ahora)`).
- Entidades de base en archivos `*.entity.ts`, con nombre `GatoEntity`. Un mapper traduce entre las dos.
- Repositorios tipados: `Repository<GatoEntity>`. Nada de SQL suelto en el código de la app.
- Nada de tipos anónimos: lo que entra y sale por HTTP es una clase DTO.
- Valores por defecto en vez de `undefined`. Los pocos `null` tienen un comentario que dice qué significan.
- `enum` con textos para valores finitos, como `EstadoTurno` o `Topico`.
- SOLID, KISS, DRY y YAGNI: clases chicas con una sola tarea, nada que no se use todavía.
- Ramas con su tipo adelante (`feature/`, `fix/`, `refactor/`) y commits con Conventional Commits.
