import { Duenio } from '../../dominio/duenio'
import { Gato } from '../../dominio/gato'
import type { DuenioEntity } from './duenio.entity'
import type { GatoEntity } from './gato.entity'

// Traduce de la fila de la base a la entidad del dominio.
export const PacientesMapper = {
  duenioADominio: (fila: DuenioEntity): Duenio => new Duenio(fila.id, fila.nombre, fila.email),

  gatoADominio: (fila: GatoEntity): Gato =>
    Gato.reconstruir({
      id: fila.id,
      nombre: fila.nombre,
      nacimiento: fila.nacimiento,
      alergias: fila.alergias,
      duenioId: fila.duenioId,
      adoptado: fila.adoptado,
    }),
} as const
