import { Inject, Injectable } from '@nestjs/common'
import { GATO_REPOSITORY, type IGatoRepository } from '../../pacientes/dominio/gato.repository'
import { ReglaDeNegocioRota } from '../../shared/dominio/errores'
import { AVISADOR, type IAvisador } from '../dominio/avisador'
import { type DatosDeTurno, Turno } from '../dominio/turno'
import { type ITurnoRepository, TURNO_REPOSITORY } from '../dominio/turno.repository'
import type { IReservarTurnoCasoDeUso } from './puertos/reservar-turno.caso-de-uso'

// Caso de uso: arma el paso a paso con piezas del dominio. Pide los puertos por su Symbol.
@Injectable()
export class ReservarTurnoCasoDeUso implements IReservarTurnoCasoDeUso {
  constructor(
    @Inject(TURNO_REPOSITORY) private readonly turnos: ITurnoRepository,
    @Inject(GATO_REPOSITORY) private readonly gatos: IGatoRepository,
    @Inject(AVISADOR) private readonly avisador: IAvisador,
  ) {}

  async ejecutar(datos: DatosDeTurno): Promise<Turno> {
    const turno = Turno.reservar(datos, new Date())
    await this.gatos.obtener(turno.gatoId)
    await this.asegurarHorarioLibre(turno.fechaHora)

    await this.turnos.guardar(turno)
    await this.avisador.avisarTurnoReservado(turno)
    return turno
  }

  private async asegurarHorarioLibre(fechaHora: Date): Promise<void> {
    if (await this.turnos.estaOcupado(fechaHora)) throw new ReglaDeNegocioRota('Ese horario ya está ocupado')
  }
}
