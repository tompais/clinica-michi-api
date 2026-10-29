import type { DatosDeGato, Gato } from './gato'

// Cómo filtrar la lista de gatos.
export abstract class FiltroDeGatos {
  constructor(readonly enAdopcion: boolean) {}
}

// Puerto: lo que el dominio necesita del archivo de gatos.
export interface IGatoRepository {
  crear(datos: DatosDeGato): Promise<Gato>
  // Devuelve el gato o tira NoEncontrado. Así nadie tiene que acordarse de chequear un null.
  obtener(id: number): Promise<Gato>
  listar(filtro: FiltroDeGatos): Promise<readonly Gato[]>
}

export const GATO_REPOSITORY = Symbol('GATO_REPOSITORY')
