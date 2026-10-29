import { describe, expect, it } from 'vitest'
import type { CrearDuenioRequestBody } from '../src/pacientes/infraestructura/http/crear-duenio.request-body'
import type { CrearGatoRequestBody } from '../src/pacientes/infraestructura/http/crear-gato.request-body'
import type { GatoResponse } from '../src/pacientes/infraestructura/http/gato.response'
import { DuenioEntity } from '../src/pacientes/infraestructura/persistencia/duenio.entity'
import { COPITO, PANCHO, usarClinicaDePrueba } from './support/app-de-prueba'

describe('Pacientes', () => {
  const clinica = usarClinicaDePrueba()

  it('lista los gatos ordenados por nombre y marca los que están en adopción', async () => {
    // Act
    const gatos = await clinica().listarGatos()

    // Assert
    expect(gatos.map((gato) => gato.nombre)).toEqual(['Copito', 'Nube', 'Tom'])
    expect(gatos[0]).toMatchObject({ id: COPITO, duenioId: null, enAdopcion: true })
  })

  it('filtra los gatos en adopción con un query param', async () => {
    // Act
    const respuesta = await clinica().http().get('/gatos?enAdopcion=true')

    // Assert
    expect(respuesta.status).toBe(200)
    const gatos: readonly GatoResponse[] = respuesta.body
    expect(gatos.map((gato) => gato.id)).toEqual([COPITO])
  })

  it('crea un gato con valores por defecto cuando no mandan alergias ni dueño', async () => {
    // Arrange
    const gatoNuevo: Partial<CrearGatoRequestBody> = { nombre: 'Luna', nacimiento: '2024-05-02' }

    // Act
    const respuesta = await clinica().http().post('/gatos').send(gatoNuevo)

    // Assert
    expect(respuesta.status).toBe(201)
    expect(respuesta.body).toMatchObject({ nombre: 'Luna', alergias: '', duenioId: null, enAdopcion: true })
  })

  it('rechaza un dueño con un email inválido', async () => {
    // Arrange
    const duenio: CrearDuenioRequestBody = { nombre: 'Ana', email: 'no-es-un-mail' }

    // Act
    const respuesta = await clinica().http().post('/duenios').send(duenio)

    // Assert
    expect(respuesta.status).toBe(400)
  })

  it('da de baja a un dueño con borrado lógico: la fila queda, con fecha de baja', async () => {
    // Act
    const respuesta = await clinica().http().delete(`/duenios/${PANCHO}`)

    // Assert
    expect(respuesta.status).toBe(204)
    const duenios = clinica().db.getRepository(DuenioEntity)
    expect(await duenios.findOneBy({ id: PANCHO })).toBeNull()
    const borrado = await duenios.findOne({ where: { id: PANCHO }, withDeleted: true })
    expect(borrado?.borradoEn).toBeInstanceOf(Date)
  })

  it('responde 404 al dar de baja un dueño que no existe', async () => {
    // Act
    const respuesta = await clinica().http().delete('/duenios/999')

    // Assert
    expect(respuesta.status).toBe(404)
  })

  it('la base no deja borrar de verdad a un dueño que tiene gatos (ON DELETE RESTRICT)', async () => {
    // Arrange
    const duenios = clinica().db.getRepository(DuenioEntity)

    // Act
    const borrado = duenios.delete(PANCHO)

    // Assert
    await expect(borrado).rejects.toThrow(/foreign key/)
  })
})
