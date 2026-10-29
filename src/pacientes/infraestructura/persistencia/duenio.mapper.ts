import { Duenio } from '../../dominio/duenio'
import type { DuenioEntity } from './duenio.entity'

// Traduce la fila de la base a la entidad del dominio.
export function duenioADominio(fila: DuenioEntity): Duenio {
  return new Duenio(fila.id, fila.nombre, fila.email)
}
