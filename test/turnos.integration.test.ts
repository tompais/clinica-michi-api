import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { type AppDePrueba, crearAppDePrueba, enHoras, NUBE } from './support/app-de-prueba'

describe('Turnos', () => {
  let clinica: AppDePrueba

  beforeAll(async () => {
    clinica = await crearAppDePrueba()
  })

  beforeEach(async () => {
    await clinica.reiniciar()
  })

  afterAll(async () => {
    await clinica.app.close()
  })

  const reservar = (datos: object) => clinica.http().post('/turnos').send(datos)

  it('reserva un turno pendiente y le avisa al dueño', async () => {
    // Arrange
    const pedido = { gatoId: NUBE, fechaHora: enHoras(24), motivo: 'Vacuna' }

    // Act
    const respuesta = await reservar(pedido)

    // Assert
    expect(respuesta.status).toBe(201)
    expect(respuesta.body).toMatchObject({ gatoId: NUBE, motivo: 'Vacuna', estado: 'PENDIENTE' })
    expect(clinica.avisador.avisarTurnoReservado).toHaveBeenCalledOnce()
  })

  it('no reserva en el pasado (422) y no avisa a nadie', async () => {
    // Act
    const respuesta = await reservar({ gatoId: NUBE, fechaHora: enHoras(-1), motivo: 'Control' })

    // Assert
    expect(respuesta.status).toBe(422)
    expect(clinica.avisador.avisarTurnoReservado).not.toHaveBeenCalled()
  })

  it('valida la forma del pedido antes de llegar al caso de uso (400)', async () => {
    // Act
    const respuesta = await reservar({ gatoId: NUBE, fechaHora: enHoras(24) })

    // Assert
    expect(respuesta.status).toBe(400)
  })

  it('responde 404 si el gato no existe', async () => {
    // Act
    const respuesta = await reservar({ gatoId: 999, fechaHora: enHoras(24), motivo: 'Control' })

    // Assert
    expect(respuesta.status).toBe(404)
  })

  it('no deja reservar dos turnos en el mismo horario', async () => {
    // Arrange
    const fechaHora = enHoras(24)
    await reservar({ gatoId: NUBE, fechaHora, motivo: 'Vacuna' })

    // Act
    const respuesta = await reservar({ gatoId: NUBE, fechaHora, motivo: 'Control' })

    // Assert
    expect(respuesta.status).toBe(422)
  })

  it('cancela un turno con anticipación', async () => {
    // Arrange
    const { body: turno } = await reservar({ gatoId: NUBE, fechaHora: enHoras(24), motivo: 'Vacuna' })

    // Act
    const respuesta = await clinica.http().post(`/turnos/${turno.id}/cancelar`)

    // Assert
    expect(respuesta.status).toBe(200)
    expect(respuesta.body.estado).toBe('CANCELADO')
  })
})
