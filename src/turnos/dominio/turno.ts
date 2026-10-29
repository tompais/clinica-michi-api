import { randomUUID } from 'node:crypto'
import { ReglaDeNegocioRota } from '../../shared/dominio/errores'
import { horasEntre } from '../../shared/dominio/fechas'
import { EstadoTurno } from './estado-turno'

const HORAS_MINIMAS_PARA_CANCELAR = 2

export interface IDatosDeTurno {
  readonly gatoId: number
  readonly fechaHora: Date
  readonly motivo: string
}

// Un turno ya guardado: además de sus datos, tiene id y estado.
export interface ITurnoGuardado extends IDatosDeTurno {
  readonly id: string
  readonly estado: EstadoTurno
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

  static reservar(datos: IDatosDeTurno, ahora: Date): Turno {
    if (datos.fechaHora <= ahora) throw new ReglaDeNegocioRota('No se puede reservar un turno en el pasado')
    return new Turno(randomUUID(), datos.gatoId, datos.fechaHora, datos.motivo, EstadoTurno.PENDIENTE)
  }

  static reconstruir(datos: ITurnoGuardado): Turno {
    return new Turno(datos.id, datos.gatoId, datos.fechaHora, datos.motivo, datos.estado)
  }

  get estaCancelado(): boolean {
    return this.estado === EstadoTurno.CANCELADO
  }

  cancelar(ahora: Date): Turno {
    if (this.estaCancelado) throw new ReglaDeNegocioRota('El turno ya estaba cancelado')
    if (horasEntre(ahora, this.fechaHora) < HORAS_MINIMAS_PARA_CANCELAR) {
      throw new ReglaDeNegocioRota(`Se cancela con al menos ${HORAS_MINIMAS_PARA_CANCELAR} horas de anticipación`)
    }
    return new Turno(this.id, this.gatoId, this.fechaHora, this.motivo, EstadoTurno.CANCELADO)
  }
}
