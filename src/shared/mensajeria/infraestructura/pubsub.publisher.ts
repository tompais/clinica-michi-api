import { PubSub } from '@google-cloud/pubsub'
import { Injectable } from '@nestjs/common'
import type { EventoPublisher } from '../dominio/evento-publisher'
import type { Topico } from '../dominio/topico'

// Adaptador real: publica en un tópico de Pub/Sub de Google.
@Injectable()
export class PubSubPublisher implements EventoPublisher {
  private readonly pubsub = new PubSub()

  async publicar(topico: Topico, datos: Readonly<Record<string, unknown>>): Promise<void> {
    await this.pubsub.topic(topico).publishMessage({ json: datos })
  }
}
