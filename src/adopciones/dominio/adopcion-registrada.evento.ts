import { EventoDeDominio } from '../../shared/mensajeria/dominio/evento-de-dominio'
import { Topico } from '../../shared/mensajeria/dominio/topico'

// El evento que avisa que un gato encontró casa.
export class AdopcionRegistrada extends EventoDeDominio {
  readonly topico = Topico.ADOPCION_REGISTRADA

  constructor(
    readonly gatoId: number,
    readonly duenioId: number,
  ) {
    super()
  }
}
