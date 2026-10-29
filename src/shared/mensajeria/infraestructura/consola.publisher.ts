import { Injectable, Logger } from '@nestjs/common'
import type { IEventoDeDominio } from '../dominio/evento-de-dominio'
import type { IEventoPublisher } from '../dominio/evento-publisher'

// Adaptador para tu compu: en vez de publicar, escribe el evento en la consola.
@Injectable()
export class ConsolaPublisher implements IEventoPublisher {
  private readonly logger = new Logger('Eventos')

  async publicar(evento: IEventoDeDominio): Promise<void> {
    this.logger.log(`📨 ${evento.topico}: ${JSON.stringify(evento)}`)
  }
}
