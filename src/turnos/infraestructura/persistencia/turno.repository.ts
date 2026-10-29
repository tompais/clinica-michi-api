import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { And, LessThan, MoreThanOrEqual, Not, type Repository } from 'typeorm'
import { NoEncontrado } from '../../../shared/dominio/errores'
import { EstadoTurno } from '../../dominio/estado-turno'
import type { Turno } from '../../dominio/turno'
import type { ITurnoRepository } from '../../dominio/turno.repository'
import { TurnoEntity } from './turno.entity'
import { turnoADominio, turnoAEntity } from './turno.mapper'

// Adaptador: implementa el puerto ITurnoRepository con un repositorio tipado de TypeORM.
@Injectable()
export class TurnoRepository implements ITurnoRepository {
  constructor(@InjectRepository(TurnoEntity) private readonly repo: Repository<TurnoEntity>) {}

  async guardar(turno: Turno): Promise<void> {
    await this.repo.save(turnoAEntity(turno))
  }

  async obtener(id: string): Promise<Turno> {
    const fila = await this.repo.findOneBy({ id })
    if (!fila) throw new NoEncontrado('el turno', id)
    return turnoADominio(fila)
  }

  estaOcupado(fechaHora: Date): Promise<boolean> {
    return this.repo.existsBy({ fechaHora, estado: Not(EstadoTurno.CANCELADO) })
  }

  async buscarEntre(desde: Date, hasta: Date): Promise<readonly Turno[]> {
    const filas = await this.repo.find({
      where: { fechaHora: And(MoreThanOrEqual(desde), LessThan(hasta)) },
      order: { fechaHora: 'ASC' },
    })
    return filas.map(turnoADominio)
  }
}
