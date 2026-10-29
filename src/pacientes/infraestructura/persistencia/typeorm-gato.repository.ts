import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import type { Repository } from 'typeorm'
import { NoEncontrado } from '../../../shared/dominio/errores'
import type { DatosDeGato, Gato } from '../../dominio/gato'
import type { GatoRepository } from '../../dominio/gato.repository'
import { GatoEntity } from './gato.entity'
import { PacientesMapper } from './pacientes.mapper'

// Adaptador: implementa el puerto GatoRepository con un repositorio tipado de TypeORM.
@Injectable()
export class TypeOrmGatoRepository implements GatoRepository {
  constructor(@InjectRepository(GatoEntity) private readonly repo: Repository<GatoEntity>) {}

  async crear(datos: DatosDeGato): Promise<Gato> {
    const fila = await this.repo.save(this.repo.create(datos))
    return PacientesMapper.gatoADominio(fila)
  }

  async obtener(id: number): Promise<Gato> {
    const fila = await this.repo.findOneBy({ id })
    if (!fila) throw new NoEncontrado(`No existe el gato ${id}`)
    return PacientesMapper.gatoADominio(fila)
  }

  async listar(): Promise<readonly Gato[]> {
    const filas = await this.repo.find({ order: { nombre: 'ASC' } })
    return filas.map(PacientesMapper.gatoADominio)
  }
}
