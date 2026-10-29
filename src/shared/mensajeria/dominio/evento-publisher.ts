import type { IEventoDeDominio } from './evento-de-dominio'

// Puerto: el puesto de "alguien que publica eventos".
// A quien lo usa no le importa si es Pub/Sub o la consola.
export interface IEventoPublisher {
  publicar(evento: IEventoDeDominio): Promise<void>
}

// La interfaz se borra al compilar. El Symbol queda: es la credencial para inyectarla.
export const EVENTO_PUBLISHER = Symbol('EVENTO_PUBLISHER')
