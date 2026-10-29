import type { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { DataSource } from 'typeorm'
import { vi } from 'vitest'
import { AppModule } from '../../src/app.module'
import { cargarDatosDeEjemplo } from '../../src/shared/infraestructura/database/datos-de-ejemplo'
import { configurarApp } from '../../src/shared/infraestructura/http/configurar-app'
import { EVENTO_PUBLISHER } from '../../src/shared/mensajeria/dominio/evento-publisher'
import { AVISADOR } from '../../src/turnos/dominio/avisador'

// Los ids que deja cargarDatosDeEjemplo. Con nombre, para que los tests se lean solos.
export const PANCHO = 1
export const RITA = 2
export const NUBE = 1 // de Pancho
export const TOM = 2 // de Rita
export const COPITO = 3 // en adopción

// La app entera, con un Postgres en memoria. Se levanta una vez por archivo de tests.
// Solo se reemplazan los bordes que salen del sistema: el mail y Pub/Sub.
export async function crearAppDePrueba() {
  const avisador = { avisarTurnoReservado: vi.fn(), recordarTurno: vi.fn() }
  const eventos = { publicar: vi.fn() }

  const modulo = await Test.createTestingModule({ imports: [AppModule] })
    .overrideProvider(AVISADOR)
    .useValue(avisador)
    .overrideProvider(EVENTO_PUBLISHER)
    .useValue(eventos)
    .compile()

  const app: INestApplication = configurarApp(modulo.createNestApplication())
  await app.init()
  const db = app.get(DataSource)

  // Antes de cada test: base limpia, datos de ejemplo y espías en cero. Así ningún test depende de otro.
  async function reiniciar(): Promise<void> {
    await db.query('TRUNCATE adopciones, turnos, gatos, duenios RESTART IDENTITY CASCADE')
    await cargarDatosDeEjemplo(db)
    vi.clearAllMocks()
  }

  return { app, db, avisador, eventos, reiniciar, http: () => request(app.getHttpServer()) }
}

export type AppDePrueba = Awaited<ReturnType<typeof crearAppDePrueba>>

export function enHoras(horas: number): Date {
  return new Date(Date.now() + horas * 60 * 60 * 1000)
}
