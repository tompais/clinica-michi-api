import { Injectable, Logger } from '@nestjs/common'
import type { EventoPublisher } from '../dominio/evento-publisher'
import type { Topico } from '../dominio/topico'

// Adaptador para tu compu: en vez de publicar, escribe el evento en la consola.
@Injectable()
export class ConsolaPublisher implements EventoPublisher {
  private readonly logger = new Logger('Eventos')

  async publicar(topico: Topico, datos: Readonly<Record<string, unknown>>): Promise<void> {
    this.logger.log(`📨 ${topico}: ${JSON.stringify(datos)}`)
  }
}
