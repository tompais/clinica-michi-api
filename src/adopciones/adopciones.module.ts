import { Module } from '@nestjs/common'
import { AdoptarGatoCasoDeUso } from './aplicacion/adoptar-gato.caso-de-uso'
import { ADOPCION_REPOSITORY } from './dominio/adopcion.repository'
import { AdopcionesController } from './infraestructura/http/adopciones.controller'
import { TypeOrmAdopcionRepository } from './infraestructura/persistencia/typeorm-adopcion.repository'

// EVENTO_PUBLISHER no se importa: viene del MensajeriaModule, que es global.
@Module({
  controllers: [AdopcionesController],
  providers: [AdoptarGatoCasoDeUso, { provide: ADOPCION_REPOSITORY, useClass: TypeOrmAdopcionRepository }],
})
export class AdopcionesModule {}
