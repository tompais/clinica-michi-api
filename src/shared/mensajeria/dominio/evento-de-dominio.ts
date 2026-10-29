import type { Topico } from './topico'

// Algo que pasó en la clínica y a otros sistemas les interesa saber. Cada evento sabe a qué tópico va.
export interface IEventoDeDominio {
  readonly topico: Topico
}
