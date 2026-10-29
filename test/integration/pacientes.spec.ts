import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { DuenioEntity } from '../../src/pacientes/infraestructura/persistencia/duenio.entity'
import { type AppDePrueba, COPITO, crearAppDePrueba, PANCHO } from '../support/app-de-prueba'

describe('Pacientes', () => {
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

  it('lista los gatos ordenados por nombre y marca los que están en adopción', async () => {
    // Act
    const respuesta = await clinica.http().get('/gatos')

    // Assert
    expect(respuesta.status).toBe(200)
    expect(respuesta.body.map((gato: { nombre: string }) => gato.nombre)).toEqual(['Copito', 'Nube', 'Tom'])
    expect(respuesta.body[0]).toMatchObject({ id: COPITO, duenioId: null, enAdopcion: true })
  })

  it('crea un gato con valores por defecto cuando no mandan alergias ni dueño', async () => {
    // Arrange
    const gatoNuevo = { nombre: 'Luna', nacimiento: '2024-05-02' }

    // Act
    const respuesta = await clinica.http().post('/gatos').send(gatoNuevo)

    // Assert
    expect(respuesta.status).toBe(201)
    expect(respuesta.body).toMatchObject({ nombre: 'Luna', nacimiento: '2024-05-02', alergias: '', duenioId: null, enAdopcion: true })
  })

  it('rechaza un dueño con un email inválido', async () => {
    // Act
    const respuesta = await clinica.http().post('/duenios').send({ nombre: 'Ana', email: 'no-es-un-mail' })

    // Assert
    expect(respuesta.status).toBe(400)
  })

  it('da de baja a un dueño con borrado lógico: la fila queda, con fecha de baja', async () => {
    // Act
    const respuesta = await clinica.http().delete(`/duenios/${PANCHO}`)

    // Assert
    expect(respuesta.status).toBe(204)
    const duenios = clinica.db.getRepository(DuenioEntity)
    expect(await duenios.findOneBy({ id: PANCHO })).toBeNull()
    const borrado = await duenios.findOne({ where: { id: PANCHO }, withDeleted: true })
    expect(borrado?.borradoEn).toBeInstanceOf(Date)
  })

  it('responde 404 al dar de baja un dueño que no existe', async () => {
    // Act
    const respuesta = await clinica.http().delete('/duenios/999')

    // Assert
    expect(respuesta.status).toBe(404)
  })

  it('la base no deja borrar de verdad a un dueño que tiene gatos (ON DELETE RESTRICT)', async () => {
    // Arrange
    const duenios = clinica.db.getRepository(DuenioEntity)

    // Act
    const borrado = duenios.delete(PANCHO)

    // Assert
    await expect(borrado).rejects.toThrow(/foreign key/)
  })
})
