import type { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { DataSource } from 'typeorm'
import { afterAll, beforeAll, beforeEach, type Mocked, vi } from 'vitest'
import type { AdoptarGatoRequestBody } from '../../src/adopciones/infraestructura/http/adoptar-gato.request-body'
import { AppModule } from '../../src/app.module'
import type { GatoResponse } from '../../src/pacientes/infraestructura/http/gato.response'
import { sumarHoras } from '../../src/shared/dominio/fechas'
import { cargarDatosDeEjemplo } from '../../src/shared/infraestructura/database/datos-de-ejemplo'
import { configurarApp } from '../../src/shared/infraestructura/http/configurar-app'
import { EVENTO_PUBLISHER, type IEventoPublisher } from '../../src/shared/mensajeria/dominio/evento-publisher'
import { AVISADOR, type IAvisador } from '../../src/turnos/dominio/avisador'
import type { ReservarTurnoRequestBody } from '../../src/turnos/infraestructura/http/reservar-turno.request-body'

// Los ids que deja cargarDatosDeEjemplo. Con nombre, para que los tests se lean solos.
export const PANCHO = 1
export const RITA = 2
export const NUBE = 1 // de Pancho
export const TOM = 2 // de Rita
export const COPITO = 3 // en adopción

// La app entera, con un Postgres en memoria. Se levanta una vez por archivo de tests.
// Solo se reemplazan los bordes que salen del sistema: el mail y Pub/Sub.
export class AppDePrueba {
  private constructor(
    readonly app: INestApplication,
    readonly db: DataSource,
    readonly avisador: Mocked<IAvisador>,
    readonly eventos: Mocked<IEventoPublisher>,
  ) {}

  static async crear(): Promise<AppDePrueba> {
    const avisador: Mocked<IAvisador> = { avisarTurnoReservado: vi.fn(), recordarTurno: vi.fn() }
    const eventos: Mocked<IEventoPublisher> = { publicar: vi.fn() }

    const modulo = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(AVISADOR)
      .useValue(avisador)
      .overrideProvider(EVENTO_PUBLISHER)
      .useValue(eventos)
      .compile()

    const app = configurarApp(modulo.createNestApplication())
    await app.init()
    return new AppDePrueba(app, app.get(DataSource), avisador, eventos)
  }

  http(): request.Agent {
    return request.agent(this.app.getHttpServer())
  }

  // Partial: algunos tests mandan pedidos incompletos a propósito.
  reservarTurno(pedido: Partial<ReservarTurnoRequestBody>): request.Test {
    return this.http().post('/turnos').send(pedido)
  }

  cancelarTurno(id: string): request.Test {
    return this.http().post(`/turnos/${id}/cancelar`)
  }

  adoptar(pedido: AdoptarGatoRequestBody): request.Test {
    return this.http().post('/adopciones').send(pedido)
  }

  async listarGatos(): Promise<readonly GatoResponse[]> {
    const respuesta = await this.http().get('/gatos')
    return respuesta.body
  }

  async buscarGato(id: number): Promise<GatoResponse | undefined> {
    const gatos = await this.listarGatos()
    return gatos.find((gato) => gato.id === id)
  }

  // Antes de cada test: base limpia, datos de ejemplo y espías en cero. Así ningún test depende de otro.
  async reiniciar(): Promise<void> {
    await this.db.query('TRUNCATE adopciones, turnos, gatos, duenios RESTART IDENTITY CASCADE')
    await cargarDatosDeEjemplo(this.db)
    vi.clearAllMocks()
  }

  cerrar(): Promise<void> {
    return this.app.close()
  }
}

// Registra los hooks de cada archivo de tests: una app al principio, datos limpios antes de cada test
// y la app cerrada al final. Devuelve cómo pedir la app desde los tests.
export function usarClinicaDePrueba(): () => AppDePrueba {
  let clinica: AppDePrueba
  beforeAll(async () => {
    clinica = await AppDePrueba.crear()
  })
  beforeEach(() => clinica.reiniciar())
  afterAll(() => clinica.cerrar())
  return () => clinica
}

export function enHoras(horas: number): Date {
  return sumarHoras(new Date(), horas)
}
