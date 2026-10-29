import type { DatosDeGato, Gato } from './gato'

// Puerto: lo que el dominio necesita del archivo de gatos.
export interface GatoRepository {
  crear(datos: DatosDeGato): Promise<Gato>
  // Devuelve el gato o tira NoEncontrado. Así nadie tiene que acordarse de chequear un null.
  obtener(id: number): Promise<Gato>
  listar(): Promise<readonly Gato[]>
}

export const GATO_REPOSITORY = Symbol('GATO_REPOSITORY')
