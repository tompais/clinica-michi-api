import type { DataSourceOptions } from 'typeorm'
import { PGliteDriver } from 'typeorm-pglite'
import { AdopcionEntity } from '../../../adopciones/infraestructura/persistencia/adopcion.entity'
import { DuenioEntity } from '../../../pacientes/infraestructura/persistencia/duenio.entity'
import { GatoEntity } from '../../../pacientes/infraestructura/persistencia/gato.entity'
import { TurnoEntity } from '../../../turnos/infraestructura/persistencia/turno.entity'
import { CrearTablas1730000000000 } from './migrations/1730000000000-CrearTablas'
import { AgregarAlergias1730000000001 } from './migrations/1730000000001-AgregarAlergias'

const entities = [DuenioEntity, GatoEntity, TurnoEntity, AdopcionEntity]
// Las migraciones, en orden. La base guarda en la tabla migrations cuáles ya corrió.
const migrations = [CrearTablas1730000000000, AgregarAlergias1730000000001]
// Código interno de Postgres para el tipo date. Así una fecha sin hora vuelve como texto y la zona horaria no la corre.
const TIPO_DATE = 1082

export const usaBaseEnMemoria = (): boolean => !process.env.DATABASE_URL

// La misma configuración la usan la API, el job y el comando de migraciones.
export function opcionesDeBase(): DataSourceOptions {
  if (usaBaseEnMemoria()) {
    // Sin DATABASE_URL: un Postgres de verdad, pero en memoria (PGlite). No hace falta instalar nada.
    // Arranca vacío, corre las migraciones solo y se borra al apagar la app.
    const driver = new PGliteDriver({ parsers: { [TIPO_DATE]: (valor: string) => valor } }).driver
    return { type: 'postgres', driver, entities, migrations, migrationsRun: true, synchronize: false }
  }
  // Con DATABASE_URL: el Postgres de docker compose o el de la nube. Las migraciones las corre el workflow Migrate.
  return { type: 'postgres', url: process.env.DATABASE_URL, entities, migrations, synchronize: false }
}
