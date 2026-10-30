import { Inject, Injectable } from '@nestjs/common'
import { diasDespues } from '../../shared/dominio/fechas'
import type { Turno } from '../dominio/turno'
import { type ITurnoRepository, TURNO_REPOSITORY } from '../dominio/turno.repository'

// La agenda de un día: todos sus turnos, también los cancelados, ordenados por hora.
@Injectable()
export class ListarTurnosDelDiaCasoDeUso {
  constructor(@Inject(TURNO_REPOSITORY) private readonly turnos: ITurnoRepository) {}

  ejecutar(dia: Date): Promise<readonly Turno[]> {
    return this.turnos.buscarEntre(diasDespues(dia, 0), diasDespues(dia, 1))
  }
}
