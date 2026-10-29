import { Global, Module } from '@nestjs/common'
import { EVENTO_PUBLISHER } from './dominio/evento-publisher'
import { ConsolaPublisher } from './infraestructura/consola.publisher'
import { PubSubPublisher } from './infraestructura/pubsub.publisher'

// Global: cualquier módulo puede pedir EVENTO_PUBLISHER sin importar este módulo.
// useFactory elige el adaptador según la configuración.
@Global()
@Module({
  providers: [
    {
      provide: EVENTO_PUBLISHER,
      useFactory: () => (process.env.PUBSUB_HABILITADO === 'true' ? new PubSubPublisher() : new ConsolaPublisher()),
    },
  ],
  exports: [EVENTO_PUBLISHER],
})
export class MensajeriaModule {}
