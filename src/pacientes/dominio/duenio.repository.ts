import type { Duenio, IDatosDeDuenio } from './duenio'

// Puerto: lo que el dominio necesita del archivo de dueños.
export interface IDuenioRepository {
  crear(datos: IDatosDeDuenio): Promise<Duenio>
  // Borrado lógico. Si no existe, tira NoEncontrado.
  darDeBaja(id: number): Promise<void>
}

export const DUENIO_REPOSITORY = Symbol('DUENIO_REPOSITORY')
