import { describe, expect, it } from 'vitest'
import { diasDespues } from '../src/shared/dominio/fechas'
import { EstadoTurno } from '../src/turnos/dominio/estado-turno'
import type { ReservarTurnoRequestBody } from '../src/turnos/infraestructura/http/reservar-turno.request-body'
import type { TurnoResponse } from '../src/turnos/infraestructura/http/turno.response'
import { comoTexto, enHoras, NUBE, usarClinicaDePrueba } from './support/app-de-prueba'

describe('Turnos', () => {
  const clinica = usarClinicaDePrueba()

  it('reserva un turno pendiente y le avisa al dueño', async () => {
    // Arrange
    const pedido: ReservarTurnoRequestBody = { gatoId: NUBE, fechaHora: enHoras(24), motivo: 'Vacuna' }

    // Act
    const respuesta = await clinica().reservarTurno(pedido)

    // Assert
    expect(respuesta.status).toBe(201)
    expect(respuesta.body).toMatchObject({ gatoId: NUBE, motivo: 'Vacuna', estado: EstadoTurno.PENDIENTE })
    expect(clinica().avisador.avisarTurnoReservado).toHaveBeenCalledOnce()
  })

  it('no reserva en el pasado (422) y no avisa a nadie', async () => {
    // Act
    const respuesta = await clinica().reservarTurno({ gatoId: NUBE, fechaHora: enHoras(-1), motivo: 'Control' })

    // Assert
    expect(respuesta.status).toBe(422)
    expect(clinica().avisador.avisarTurnoReservado).not.toHaveBeenCalled()
  })

  it('valida la forma del pedido antes de llegar al caso de uso (400)', async () => {
    // Act
    const respuesta = await clinica().reservarTurno({ gatoId: NUBE, fechaHora: enHoras(24) })

    // Assert
    expect(respuesta.status).toBe(400)
  })

  it('responde 404 si el gato no existe', async () => {
    // Act
    const respuesta = await clinica().reservarTurno({ gatoId: 999, fechaHora: enHoras(24), motivo: 'Control' })

    // Assert
    expect(respuesta.status).toBe(404)
  })

  it('no deja reservar dos turnos en el mismo horario', async () => {
    // Arrange
    const fechaHora = enHoras(24)
    await clinica().reservarTurno({ gatoId: NUBE, fechaHora, motivo: 'Vacuna' })

    // Act
    const respuesta = await clinica().reservarTurno({ gatoId: NUBE, fechaHora, motivo: 'Control' })

    // Assert
    expect(respuesta.status).toBe(422)
  })

  it('cancela un turno con anticipación', async () => {
    // Arrange
    const reservado = await clinica().reservarTurno({ gatoId: NUBE, fechaHora: enHoras(24), motivo: 'Vacuna' })

    // Act
    const respuesta = await clinica().cancelarTurno(reservado.body.id)

    // Assert
    expect(respuesta.status).toBe(200)
    expect(respuesta.body.estado).toBe(EstadoTurno.CANCELADO)
  })

  it('lista la agenda de un día, ordenada por hora y con los cancelados', async () => {
    // Arrange
    await clinica().reservarTurno({ gatoId: NUBE, fechaHora: diasDespues(new Date(), 1, 11), motivo: 'Control' })
    const temprano = await clinica().reservarTurno({
      gatoId: NUBE,
      fechaHora: diasDespues(new Date(), 1, 9),
      motivo: 'Vacuna',
    })
    await clinica().cancelarTurno(temprano.body.id)
    await clinica().reservarTurno({ gatoId: NUBE, fechaHora: diasDespues(new Date(), 2, 10), motivo: 'Baño' })

    // Act
    const respuesta = await clinica()
      .http()
      .get(`/turnos?fecha=${comoTexto(diasDespues(new Date(), 1))}`)

    // Assert
    expect(respuesta.status).toBe(200)
    const agenda: readonly TurnoResponse[] = respuesta.body
    expect(agenda.map((turno) => turno.motivo)).toEqual(['Vacuna', 'Control'])
    expect(agenda[0].estado).toBe(EstadoTurno.CANCELADO)
  })

  it('pide la fecha para listar la agenda (400)', async () => {
    // Act
    const respuesta = await clinica().http().get('/turnos')

    // Assert
    expect(respuesta.status).toBe(400)
  })
})
