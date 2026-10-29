import { describe, expect, it } from 'vitest'
import { EnviarRecordatoriosCasoDeUso } from '../src/recordatorios/aplicacion/enviar-recordatorios.caso-de-uso'
import { diasDespues } from '../src/shared/dominio/fechas'
import type { IDatosDeTurno } from '../src/turnos/dominio/turno'
import { NUBE, TOM, usarClinicaDePrueba } from './support/app-de-prueba'

describe('Job de recordatorios', () => {
  const clinica = usarClinicaDePrueba()

  function reservar(gatoId: number, dias: number, hora: number) {
    const pedido: IDatosDeTurno = { gatoId, fechaHora: diasDespues(new Date(), dias, hora), motivo: 'Control' }
    return clinica().reservarTurno(pedido)
  }

  it('recuerda solo los turnos de mañana que no están cancelados', async () => {
    // Arrange
    await reservar(NUBE, 1, 10)
    const cancelado = await reservar(TOM, 1, 11)
    await clinica().cancelarTurno(cancelado.body.id)
    await reservar(TOM, 2, 10)

    // Act
    const enviados = await clinica().app.get(EnviarRecordatoriosCasoDeUso).ejecutar()

    // Assert
    expect(enviados).toBe(1)
    expect(clinica().avisador.recordarTurno).toHaveBeenCalledWith(expect.objectContaining({ gatoId: NUBE }))
  })
})
