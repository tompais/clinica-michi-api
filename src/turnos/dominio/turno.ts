import { randomUUID } from 'node:crypto'
import { ReglaDeNegocioRota } from '../../shared/dominio/errores'
import { horasEntre } from '../../shared/dominio/fechas'
import { EstadoTurno } from './estado-turno'

const HORAS_MINIMAS_PARA_CANCELAR = 2

// Los datos de un turno. Abstracta: no se crea sola, la comparten las clases que tienen estos datos.
export abstract class DatosDeTurno {
  constructor(
    readonly gatoId: number,
    readonly fechaHora: Date,
    readonly motivo: string,
  ) {}
}

// Entidad del dominio: un turno con sus reglas. No sabe nada de HTTP ni de la base.
// Inmutable: cancelar no lo modifica, devuelve un turno nuevo con el cambio.
export class Turno extends DatosDeTurno {
  private constructor(
    readonly id: string,
    gatoId: number,
    fechaHora: Date,
    motivo: string,
    readonly estado: EstadoTurno,
  ) {
    super(gatoId, fechaHora, motivo)
  }

  static reservar(datos: DatosDeTurno, ahora: Date): Turno {
    if (datos.fechaHora <= ahora) throw new ReglaDeNegocioRota('No se puede reservar un turno en el pasado')
    return new Turno(randomUUID(), datos.gatoId, datos.fechaHora, datos.motivo, EstadoTurno.PENDIENTE)
  }

  static reconstruir(id: string, datos: DatosDeTurno, estado: EstadoTurno): Turno {
    return new Turno(id, datos.gatoId, datos.fechaHora, datos.motivo, estado)
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
