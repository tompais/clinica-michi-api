import { Turno } from '../../dominio/turno'
import { TurnoEntity } from './turno.entity'

// Traduce entre la entidad del dominio y la fila de la base, en los dos sentidos.
export const TurnoMapper = {
  aDominio: (fila: TurnoEntity): Turno =>
    Turno.reconstruir({
      id: fila.id,
      gatoId: fila.gatoId,
      fechaHora: fila.fechaHora,
      motivo: fila.motivo,
      estado: fila.estado,
    }),

  aEntity: (turno: Turno): TurnoEntity =>
    Object.assign(new TurnoEntity(), {
      id: turno.id,
      gatoId: turno.gatoId,
      fechaHora: turno.fechaHora,
      motivo: turno.motivo,
      estado: turno.estado,
    }),
} as const
