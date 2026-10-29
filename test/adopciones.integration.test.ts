import { describe, expect, it } from 'vitest'
import type { IDatosDeAdopcion } from '../src/adopciones/dominio/adopcion'
import { AdopcionRegistrada } from '../src/adopciones/dominio/adopcion-registrada.evento'
import { COPITO, NUBE, RITA, usarClinicaDePrueba } from './support/app-de-prueba'

describe('Adopciones', () => {
  const clinica = usarClinicaDePrueba()

  function adoptar(gatoId: number, duenioId: number) {
    const pedido: IDatosDeAdopcion = { gatoId, duenioId }
    return clinica().adoptar(pedido)
  }

  it('Copito encuentra casa: queda adoptado y se publica el evento', async () => {
    // Act
    const respuesta = await adoptar(COPITO, RITA)

    // Assert
    expect(respuesta.status).toBe(201)
    expect(await clinica().buscarGato(COPITO)).toMatchObject({ duenioId: RITA, enAdopcion: false })
    expect(clinica().eventos.publicar).toHaveBeenCalledWith(new AdopcionRegistrada(COPITO, RITA))
  })

  it('un gato no se adopta dos veces', async () => {
    // Arrange
    await adoptar(COPITO, RITA)

    // Act
    const respuesta = await adoptar(COPITO, RITA)

    // Assert
    expect(respuesta.status).toBe(422)
  })

  it('un gato que ya tiene dueño no está en adopción y no se publica nada', async () => {
    // Act
    const respuesta = await adoptar(NUBE, RITA)

    // Assert
    expect(respuesta.status).toBe(422)
    expect(clinica().eventos.publicar).not.toHaveBeenCalled()
  })

  it('responde 404 si el dueño no existe, y Copito sigue en adopción', async () => {
    // Act
    const respuesta = await adoptar(COPITO, 999)

    // Assert
    expect(respuesta.status).toBe(404)
    expect((await clinica().buscarGato(COPITO))?.enAdopcion).toBe(true)
  })
})
