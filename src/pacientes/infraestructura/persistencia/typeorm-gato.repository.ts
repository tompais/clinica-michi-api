import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { type FindOptionsWhere, IsNull, type Repository } from 'typeorm'
import { NoEncontrado } from '../../../shared/dominio/errores'
import type { Gato, IDatosDeGato } from '../../dominio/gato'
import type { IFiltroDeGatos, IGatoRepository } from '../../dominio/gato.repository'
import { GatoEntity } from './gato.entity'
import { PacientesMapper } from './pacientes.mapper'

// Adaptador: implementa el puerto IGatoRepository con un repositorio tipado de TypeORM.
@Injectable()
export class TypeOrmGatoRepository implements IGatoRepository {
  constructor(@InjectRepository(GatoEntity) private readonly repo: Repository<GatoEntity>) {}

  async crear(datos: IDatosDeGato): Promise<Gato> {
    const fila = await this.repo.save(this.repo.create(datos))
    return PacientesMapper.gatoADominio(fila)
  }

  async obtener(id: number): Promise<Gato> {
    const fila = await this.repo.findOneBy({ id })
    if (!fila) throw new NoEncontrado(`No existe el gato ${id}`)
    return PacientesMapper.gatoADominio(fila)
  }

  async listar(filtro: IFiltroDeGatos): Promise<readonly Gato[]> {
    const where: FindOptionsWhere<GatoEntity> = filtro.soloEnAdopcion ? { duenioId: IsNull(), adoptado: false } : {}
    const filas = await this.repo.find({ where, order: { nombre: 'ASC' } })
    return filas.map(PacientesMapper.gatoADominio)
  }
}
