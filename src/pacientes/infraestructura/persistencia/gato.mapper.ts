import { Gato } from '../../dominio/gato'
import { GatoEntity } from './gato.entity'

// Traduce entre la entidad del dominio y la fila de la base, en los dos sentidos.
export function gatoADominio(fila: GatoEntity): Gato {
  return Gato.reconstruir(fila.id, fila, fila.adoptado)
}

export function gatoAEntity(gato: Gato): GatoEntity {
  const fila = new GatoEntity()
  fila.id = gato.id
  fila.nombre = gato.nombre
  fila.nacimiento = gato.nacimiento
  fila.alergias = gato.alergias
  fila.duenioId = gato.duenioId
  fila.adoptado = gato.adoptado
  return fila
}
