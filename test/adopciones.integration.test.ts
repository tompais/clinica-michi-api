import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { Topico } from '../src/shared/mensajeria/dominio/topico'
import { type AppDePrueba, COPITO, crearAppDePrueba, NUBE, RITA } from './support/app-de-prueba'

describe('Adopciones', () => {
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

  const adoptar = (gatoId: number, duenioId: number) => clinica.http().post('/adopciones').send({ gatoId, duenioId })

  it('Copito encuentra casa: queda adoptado y se publica el evento', async () => {
    // Act
    const respuesta = await adoptar(COPITO, RITA)

    // Assert
    expect(respuesta.status).toBe(201)
    const { body: gatos } = await clinica.http().get('/gatos')
    expect(gatos.find((gato: { id: number }) => gato.id === COPITO)).toMatchObject({ duenioId: RITA, enAdopcion: false })
    expect(clinica.eventos.publicar).toHaveBeenCalledWith(Topico.ADOPCION_REGISTRADA, { gatoId: COPITO, duenioId: RITA })
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
    expect(clinica.eventos.publicar).not.toHaveBeenCalled()
  })

  it('responde 404 si el dueño no existe, y Copito sigue en adopción', async () => {
    // Act
    const respuesta = await adoptar(COPITO, 999)

    // Assert
    expect(respuesta.status).toBe(404)
    const { body: gatos } = await clinica.http().get('/gatos')
    expect(gatos.find((gato: { id: number }) => gato.id === COPITO).enAdopcion).toBe(true)
  })
})
