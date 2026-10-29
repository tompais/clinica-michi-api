import type { Adopcion, DatosDeAdopcion } from './adopcion'

// Puerto: registrar una adopción es todo o nada.
// El gato pasa a su dueño y queda la constancia, o no pasa nada.
export interface IAdopcionRepository {
  registrar(datos: DatosDeAdopcion): Promise<Adopcion>
}

export const ADOPCION_REPOSITORY = Symbol('ADOPCION_REPOSITORY')
