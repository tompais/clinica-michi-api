import { Turno } from '../../dominio/turno'
import { TurnoEntity } from './turno.entity'

// Traduce entre la entidad del dominio y la fila de la base, en los dos sentidos.
export function turnoADominio(fila: TurnoEntity): Turno {
  return Turno.reconstruir(fila)
}

export function turnoAEntity(turno: Turno): TurnoEntity {
  const fila = new TurnoEntity()
  fila.id = turno.id
  fila.gatoId = turno.gatoId
  fila.fechaHora = turno.fechaHora
  fila.motivo = turno.motivo
  fila.estado = turno.estado
  return fila
}
