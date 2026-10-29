import { describe, expect, it } from 'vitest'
import { ReglaDeNegocioRota } from '../src/shared/dominio/errores'
import { EstadoTurno } from '../src/turnos/dominio/estado-turno'
import { Turno } from '../src/turnos/dominio/turno'

// Unitario solo para la regla que tiene bordes finos: las 2 horas para cancelar.
// Lo demás del turno ya lo cubren los tests de integración.
const AHORA = new Date('2026-11-02T10:00:00Z')
const turnoA = (fechaHora: string) => Turno.reservar({ gatoId: 1, fechaHora: new Date(fechaHora), motivo: 'Vacuna' }, AHORA)

describe('Turno.cancelar', () => {
  it('devuelve un turno nuevo cancelado y deja el original como estaba', () => {
    // Arrange
    const turno = turnoA('2026-11-02T12:00:00Z')

    // Act
    const cancelado = turno.cancelar(AHORA)

    // Assert
    expect(cancelado.estado).toBe(EstadoTurno.CANCELADO)
    expect(turno.estado).toBe(EstadoTurno.PENDIENTE)
  })

  it('no deja cancelar con menos de 2 horas de anticipación', () => {
    // Arrange
    const turno = turnoA('2026-11-02T11:59:00Z')

    // Act
    const cancelar = () => turno.cancelar(AHORA)

    // Assert
    expect(cancelar).toThrow(ReglaDeNegocioRota)
  })

  it('no deja cancelar dos veces', () => {
    // Arrange
    const cancelado = turnoA('2026-11-03T10:00:00Z').cancelar(AHORA)

    // Act
    const cancelarOtraVez = () => cancelado.cancelar(AHORA)

    // Assert
    expect(cancelarOtraVez).toThrow('ya estaba cancelado')
  })
})
