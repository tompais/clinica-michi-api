import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { opcionesDeBase } from './opciones-de-base'

// La usa el comando de migraciones: bun run migration:run
export default new DataSource(opcionesDeBase())
