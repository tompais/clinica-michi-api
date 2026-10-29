import { Inject, Injectable } from '@nestjs/common'
import { EVENTO_PUBLISHER, type IEventoPublisher } from '../../shared/mensajeria/dominio/evento-publisher'
import { Topico } from '../../shared/mensajeria/dominio/topico'
import type { Adopcion, IDatosDeAdopcion } from '../dominio/adopcion'
import { ADOPCION_REPOSITORY, type IAdopcionRepository } from '../dominio/adopcion.repository'

@Injectable()
export class AdoptarGatoCasoDeUso {
  constructor(
    @Inject(ADOPCION_REPOSITORY) private readonly adopciones: IAdopcionRepository,
    @Inject(EVENTO_PUBLISHER) private readonly eventos: IEventoPublisher,
  ) {}

  async ejecutar(datos: IDatosDeAdopcion): Promise<Adopcion> {
    const adopcion = await this.adopciones.registrar(datos)
    // Se publica después del commit: nadie se entera de una adopción que no llegó a guardarse.
    await this.eventos.publicar(Topico.ADOPCION_REGISTRADA, { gatoId: adopcion.gatoId, duenioId: adopcion.duenioId })
    return adopcion
  }
}
