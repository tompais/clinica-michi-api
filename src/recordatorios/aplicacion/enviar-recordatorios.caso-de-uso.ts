import { Inject, Injectable, Logger } from '@nestjs/common'
import { diasDespues } from '../../shared/dominio/fechas'
import { AVISADOR, type IAvisador } from '../../turnos/dominio/avisador'
import { type ITurnoRepository, TURNO_REPOSITORY } from '../../turnos/dominio/turno.repository'
import type { IEnviarRecordatoriosCasoDeUso } from './puertos/enviar-recordatorios.caso-de-uso'

// Lo corre el job de todos los días a las 9: le recuerda a cada dueño su turno de mañana.
@Injectable()
export class EnviarRecordatoriosCasoDeUso implements IEnviarRecordatoriosCasoDeUso {
  private readonly logger = new Logger('Recordatorios')

  constructor(
    @Inject(TURNO_REPOSITORY) private readonly turnos: ITurnoRepository,
    @Inject(AVISADOR) private readonly avisador: IAvisador,
  ) {}

  async ejecutar(hoy: Date): Promise<number> {
    const turnosDeManiana = await this.turnos.buscarEntre(diasDespues(hoy, 1), diasDespues(hoy, 2))
    const activos = turnosDeManiana.filter((turno) => !turno.estaCancelado)

    for (const turno of activos) await this.avisador.recordarTurno(turno)

    this.logger.log(`Recordatorios enviados: ${activos.length}`)
    return activos.length
  }
}
