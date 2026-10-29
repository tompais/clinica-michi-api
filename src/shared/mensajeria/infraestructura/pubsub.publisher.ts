import { PubSub } from '@google-cloud/pubsub'
import { Injectable } from '@nestjs/common'
import type { EventoDeDominio } from '../dominio/evento-de-dominio'
import type { IEventoPublisher } from '../dominio/evento-publisher'

// Adaptador real: publica en un tópico de Pub/Sub de Google.
@Injectable()
export class PubSubPublisher implements IEventoPublisher {
  private readonly pubsub = new PubSub()

  async publicar(evento: EventoDeDominio): Promise<void> {
    await this.pubsub.topic(evento.topico).publishMessage({ json: evento })
  }
}
