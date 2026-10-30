import { Inject, Injectable } from '@nestjs/common'
import type { Turno } from '../dominio/turno'
import { type ITurnoRepository, TURNO_REPOSITORY } from '../dominio/turno.repository'
import type { ICancelarTurnoCasoDeUso } from './puertos/cancelar-turno.caso-de-uso'

@Injectable()
export class CancelarTurnoCasoDeUso implements ICancelarTurnoCasoDeUso {
  constructor(@Inject(TURNO_REPOSITORY) private readonly turnos: ITurnoRepository) {}

  async ejecutar(id: string): Promise<Turno> {
    const turno = await this.turnos.obtener(id)
    try {
      turno.cancelar(new Date())
    } catch (error) {
      console.log(error)
    }
    await this.turnos.guardar(turno)
    return turno
  }
}
