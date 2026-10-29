import { randomUUID } from 'node:crypto'
import { ReglaDeNegocioRota } from '../../shared/dominio/errores'
import { EstadoTurno } from './estado-turno'

const HORAS_MINIMAS_PARA_CANCELAR = 2
const MILISEGUNDOS_POR_HORA = 60 * 60 * 1000

export interface DatosDeTurno {
  readonly gatoId: number
  readonly fechaHora: Date
  readonly motivo: string
}

// Entidad del dominio: un turno con sus reglas. No sabe nada de HTTP ni de la base.
// Inmutable: cancelar no lo modifica, devuelve un turno nuevo con el cambio.
export class Turno {
  private constructor(
    readonly id: string,
    readonly gatoId: number,
    readonly fechaHora: Date,
    readonly motivo: string,
    readonly estado: EstadoTurno,
  ) {}

  static reservar(datos: DatosDeTurno, ahora: Date): Turno {
    if (datos.fechaHora <= ahora) throw new ReglaDeNegocioRota('No se puede reservar un turno en el pasado')
    return new Turno(randomUUID(), datos.gatoId, datos.fechaHora, datos.motivo, EstadoTurno.PENDIENTE)
  }

  static reconstruir(datos: DatosDeTurno & { readonly id: string; readonly estado: EstadoTurno }): Turno {
    return new Turno(datos.id, datos.gatoId, datos.fechaHora, datos.motivo, datos.estado)
  }

  get estaCancelado(): boolean {
    return this.estado === EstadoTurno.CANCELADO
  }

  cancelar(ahora: Date): Turno {
    if (this.estaCancelado) throw new ReglaDeNegocioRota('El turno ya estaba cancelado')
    if (this.horasQueFaltan(ahora) < HORAS_MINIMAS_PARA_CANCELAR) {
      throw new ReglaDeNegocioRota(`Se cancela con al menos ${HORAS_MINIMAS_PARA_CANCELAR} horas de anticipación`)
    }
    return new Turno(this.id, this.gatoId, this.fechaHora, this.motivo, EstadoTurno.CANCELADO)
  }

  private horasQueFaltan(ahora: Date): number {
    return (this.fechaHora.getTime() - ahora.getTime()) / MILISEGUNDOS_POR_HORA
  }
}
