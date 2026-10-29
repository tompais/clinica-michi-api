import type { Topico } from './topico'

// Algo que pasó en la clínica y a otros sistemas les interesa saber.
// Abstracta: cada evento concreto la extiende y dice a qué tópico va.
export abstract class EventoDeDominio {
  abstract readonly topico: Topico
}
