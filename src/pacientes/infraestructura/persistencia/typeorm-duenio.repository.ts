import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import type { Repository } from 'typeorm'
import { NoEncontrado } from '../../../shared/dominio/errores'
import type { DatosDeDuenio, Duenio } from '../../dominio/duenio'
import type { DuenioRepository } from '../../dominio/duenio.repository'
import { DuenioEntity } from './duenio.entity'
import { PacientesMapper } from './pacientes.mapper'

// Adaptador: implementa el puerto DuenioRepository con un repositorio tipado de TypeORM.
@Injectable()
export class TypeOrmDuenioRepository implements DuenioRepository {
  constructor(@InjectRepository(DuenioEntity) private readonly repo: Repository<DuenioEntity>) {}

  async crear(datos: DatosDeDuenio): Promise<Duenio> {
    const fila = await this.repo.save(this.repo.create(datos))
    return PacientesMapper.duenioADominio(fila)
  }

  async darDeBaja(id: number): Promise<void> {
    const resultado = await this.repo.softDelete(id)
    if (!resultado.affected) throw new NoEncontrado(`No existe el dueño ${id}`)
  }
}
