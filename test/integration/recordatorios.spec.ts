import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { EnviarRecordatoriosCasoDeUso } from '../../src/recordatorios/aplicacion/enviar-recordatorios.caso-de-uso'
import { type AppDePrueba, crearAppDePrueba, NUBE, TOM } from '../support/app-de-prueba'

function maniana(hora: number): Date {
  const fecha = new Date()
  fecha.setDate(fecha.getDate() + 1)
  fecha.setHours(hora, 0, 0, 0)
  return fecha
}

describe('Job de recordatorios', () => {
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

  const reservar = (gatoId: number, fechaHora: Date) =>
    clinica.http().post('/turnos').send({ gatoId, fechaHora, motivo: 'Control' })

  it('recuerda solo los turnos de mañana que no están cancelados', async () => {
    // Arrange
    await reservar(NUBE, maniana(10))
    const { body: cancelado } = await reservar(TOM, maniana(11))
    await clinica.http().post(`/turnos/${cancelado.id}/cancelar`)
    const pasadoManiana = maniana(10)
    pasadoManiana.setDate(pasadoManiana.getDate() + 1)
    await reservar(TOM, pasadoManiana)

    // Act
    const enviados = await clinica.app.get(EnviarRecordatoriosCasoDeUso).ejecutar()

    // Assert
    expect(enviados).toBe(1)
    expect(clinica.avisador.recordarTurno).toHaveBeenCalledWith(expect.objectContaining({ gatoId: NUBE }))
  })
})
