import type { Gato, IDatosDeGato } from './gato'

export interface IFiltroDeGatos {
  readonly soloEnAdopcion: boolean
}

// Puerto: lo que el dominio necesita del archivo de gatos.
export interface IGatoRepository {
  crear(datos: IDatosDeGato): Promise<Gato>
  // Devuelve el gato o tira NoEncontrado. Así nadie tiene que acordarse de chequear un null.
  obtener(id: number): Promise<Gato>
  listar(filtro: IFiltroDeGatos): Promise<readonly Gato[]>
}

export const GATO_REPOSITORY = Symbol('GATO_REPOSITORY')
