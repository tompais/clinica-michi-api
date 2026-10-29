import { Injectable } from '@nestjs/common'
import { DataSource, type EntityManager } from 'typeorm'
import type { Gato } from '../../../pacientes/dominio/gato'
import { DuenioEntity } from '../../../pacientes/infraestructura/persistencia/duenio.entity'
import { GatoEntity } from '../../../pacientes/infraestructura/persistencia/gato.entity'
import { PacientesMapper } from '../../../pacientes/infraestructura/persistencia/pacientes.mapper'
import { NoEncontrado } from '../../../shared/dominio/errores'
import { Adopcion, type DatosDeAdopcion } from '../../dominio/adopcion'
import type { AdopcionRepository } from '../../dominio/adopcion.repository'
import { AdopcionEntity } from './adopcion.entity'

// Adaptador: la adopción entera corre en una transacción.
// La regla de quién se puede adoptar la decide el dominio (Gato.adoptar). Acá solo se guarda.
@Injectable()
export class TypeOrmAdopcionRepository implements AdopcionRepository {
  constructor(private readonly dataSource: DataSource) {}

  registrar(datos: DatosDeAdopcion): Promise<Adopcion> {
    return this.dataSource.transaction(async (manager) => {
      const gato = await this.bloquearGato(manager, datos.gatoId)
      await this.asegurarQueExisteElDuenio(manager, datos.duenioId)

      const adoptado = gato.adoptar(datos.duenioId)
      await manager.getRepository(GatoEntity).update(adoptado.id, { duenioId: adoptado.duenioId, adoptado: adoptado.adoptado })

      const adopciones = manager.getRepository(AdopcionEntity)
      const fila = await adopciones.save(adopciones.create(datos))
      return new Adopcion(fila.id, fila.gatoId, fila.duenioId, fila.fecha)
    })
  }

  // FOR UPDATE: si dos personas adoptan al mismo gato a la vez, la segunda espera a que termine la primera.
  private async bloquearGato(manager: EntityManager, id: number): Promise<Gato> {
    const fila = await manager.getRepository(GatoEntity).findOne({ where: { id }, lock: { mode: 'pessimistic_write' } })
    if (!fila) throw new NoEncontrado(`No existe el gato ${id}`)
    return PacientesMapper.gatoADominio(fila)
  }

  private async asegurarQueExisteElDuenio(manager: EntityManager, id: number): Promise<void> {
    const existe = await manager.getRepository(DuenioEntity).existsBy({ id })
    if (!existe) throw new NoEncontrado(`No existe el dueño ${id}`)
  }
}
