import type { Adopcion, IDatosDeAdopcion } from './adopcion'

// Puerto: registrar una adopción es todo o nada.
// El gato pasa a su dueño y queda la constancia, o no pasa nada.
export interface IAdopcionRepository {
  registrar(datos: IDatosDeAdopcion): Promise<Adopcion>
}

export const ADOPCION_REPOSITORY = Symbol('ADOPCION_REPOSITORY')
