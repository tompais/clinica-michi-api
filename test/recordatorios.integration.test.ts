import { describe, expect, it } from 'vitest'
import {
  ENVIAR_RECORDATORIOS_CASO_DE_USO,
  type IEnviarRecordatoriosCasoDeUso,
} from '../src/recordatorios/aplicacion/puertos/enviar-recordatorios.caso-de-uso'
import { diasDespues } from '../src/shared/dominio/fechas'
import type { ReservarTurnoRequestBody } from '../src/turnos/infraestructura/http/reservar-turno.request-body'
import { NUBE, TOM, usarClinicaDePrueba } from './support/app-de-prueba'

describe('Job de recordatorios', () => {
  const clinica = usarClinicaDePrueba()

  function reservar(gatoId: number, dias: number, hora: number) {
    const pedido: ReservarTurnoRequestBody = {
      gatoId,
      fechaHora: diasDespues(new Date(), dias, hora),
      motivo: 'Control',
    }
    return clinica().reservarTurno(pedido)
  }

  it('recuerda solo los turnos de mañana que no están cancelados', async () => {
    // Arrange
    await reservar(NUBE, 1, 10)
    const cancelado = await reservar(TOM, 1, 11)
    await clinica().cancelarTurno(cancelado.body.id)
    await reservar(TOM, 2, 10)

    // Act
    const enviados = await clinica()
      .app.get<IEnviarRecordatoriosCasoDeUso>(ENVIAR_RECORDATORIOS_CASO_DE_USO)
      .ejecutar(new Date())

    // Assert
    expect(enviados).toBe(1)
    expect(clinica().avisador.recordarTurno).toHaveBeenCalledWith(expect.objectContaining({ gatoId: NUBE }))
  })
})
