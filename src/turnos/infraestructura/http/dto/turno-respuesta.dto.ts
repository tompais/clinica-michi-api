import type { EstadoTurno } from '../../../dominio/estado-turno'
import type { Turno } from '../../../dominio/turno'

// Lo que sale por HTTP. Separado de la entidad: el dominio puede cambiar sin romper la API.
export class TurnoRespuestaDto {
  private constructor(
    readonly id: string,
    readonly gatoId: number,
    readonly fechaHora: Date,
    readonly motivo: string,
    readonly estado: EstadoTurno,
  ) {}

  static desde(turno: Turno): TurnoRespuestaDto {
    return new TurnoRespuestaDto(turno.id, turno.gatoId, turno.fechaHora, turno.motivo, turno.estado)
  }
}
