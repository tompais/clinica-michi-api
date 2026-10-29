import { Inject, Injectable, Logger } from '@nestjs/common'
import { AVISADOR, type IAvisador } from '../../turnos/dominio/avisador'
import { type ITurnoRepository, TURNO_REPOSITORY } from '../../turnos/dominio/turno.repository'

interface IRango {
  readonly desde: Date
  readonly hasta: Date
}

// Lo corre el job de todos los días a las 9: le recuerda a cada dueño su turno de mañana.
@Injectable()
export class EnviarRecordatoriosCasoDeUso {
  private readonly logger = new Logger('Recordatorios')

  constructor(
    @Inject(TURNO_REPOSITORY) private readonly turnos: ITurnoRepository,
    @Inject(AVISADOR) private readonly avisador: IAvisador,
  ) {}

  async ejecutar(hoy: Date = new Date()): Promise<number> {
    const { desde, hasta } = diaSiguienteA(hoy)
    const turnosDeManiana = await this.turnos.buscarEntre(desde, hasta)
    const activos = turnosDeManiana.filter((turno) => !turno.estaCancelado)

    for (const turno of activos) await this.avisador.recordarTurno(turno)

    this.logger.log(`Recordatorios enviados: ${activos.length}`)
    return activos.length
  }
}

function diaSiguienteA(hoy: Date): IRango {
  const desde = new Date(hoy)
  desde.setHours(0, 0, 0, 0)
  desde.setDate(desde.getDate() + 1)
  const hasta = new Date(desde)
  hasta.setDate(hasta.getDate() + 1)
  return { desde, hasta }
}
