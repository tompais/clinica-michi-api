import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CrearDuenioCasoDeUso } from './aplicacion/crear-duenio.caso-de-uso'
import { CrearGatoCasoDeUso } from './aplicacion/crear-gato.caso-de-uso'
import { DarDeBajaDuenioCasoDeUso } from './aplicacion/dar-de-baja-duenio.caso-de-uso'
import { ListarGatosCasoDeUso } from './aplicacion/listar-gatos.caso-de-uso'
import { DUENIO_REPOSITORY } from './dominio/duenio.repository'
import { GATO_REPOSITORY } from './dominio/gato.repository'
import { DueniosController } from './infraestructura/http/duenios.controller'
import { GatosController } from './infraestructura/http/gatos.controller'
import { DuenioEntity } from './infraestructura/persistencia/duenio.entity'
import { DuenioRepository } from './infraestructura/persistencia/duenio.repository'
import { GatoEntity } from './infraestructura/persistencia/gato.entity'
import { GatoRepository } from './infraestructura/persistencia/gato.repository'

@Module({
  // forFeature le enseña a Nest a fabricar los Repository tipados de estas entidades.
  imports: [TypeOrmModule.forFeature([DuenioEntity, GatoEntity])],
  controllers: [DueniosController, GatosController],
  providers: [
    CrearDuenioCasoDeUso,
    DarDeBajaDuenioCasoDeUso,
    CrearGatoCasoDeUso,
    ListarGatosCasoDeUso,
    { provide: DUENIO_REPOSITORY, useClass: DuenioRepository },
    { provide: GATO_REPOSITORY, useClass: GatoRepository },
  ],
  // Turnos necesita saber si un gato existe.
  exports: [GATO_REPOSITORY],
})
export class PacientesModule {}
