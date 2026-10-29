import { Inject, Injectable } from '@nestjs/common'
import type { Turno } from '../dominio/turno'
import { type ITurnoRepository, TURNO_REPOSITORY } from '../dominio/turno.repository'

@Injectable()
export class CancelarTurnoCasoDeUso {
  constructor(@Inject(TURNO_REPOSITORY) private readonly turnos: ITurnoRepository) {}

  async ejecutar(id: string): Promise<Turno> {
    const turno = await this.turnos.obtener(id)
    const cancelado = turno.cancelar(new Date())
    await this.turnos.guardar(cancelado)
    return cancelado
  }
}
