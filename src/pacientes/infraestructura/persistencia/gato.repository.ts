import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { type FindOptionsWhere, IsNull, type Repository } from 'typeorm'
import { NoEncontrado } from '../../../shared/dominio/errores'
import type { DatosDeGato, Gato } from '../../dominio/gato'
import type { FiltroDeGatos, IGatoRepository } from '../../dominio/gato.repository'
import { GatoEntity } from './gato.entity'
import { gatoADominio } from './gato.mapper'

// Adaptador: implementa el puerto IGatoRepository con un repositorio tipado de TypeORM.
@Injectable()
export class GatoRepository implements IGatoRepository {
  constructor(@InjectRepository(GatoEntity) private readonly repo: Repository<GatoEntity>) {}

  async crear(datos: DatosDeGato): Promise<Gato> {
    const fila = await this.repo.save(this.repo.create(datos))
    return gatoADominio(fila)
  }

  async obtener(id: number): Promise<Gato> {
    const fila = await this.repo.findOneBy({ id })
    if (!fila) throw new NoEncontrado('el gato', id)
    return gatoADominio(fila)
  }

  async listar(filtro: FiltroDeGatos): Promise<readonly Gato[]> {
    const where: FindOptionsWhere<GatoEntity> = filtro.enAdopcion ? { duenioId: IsNull(), adoptado: false } : {}
    const filas = await this.repo.find({ where, order: { nombre: 'ASC' } })
    return filas.map(gatoADominio)
  }
}
