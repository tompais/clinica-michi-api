import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CrearDuenioCasoDeUso } from './aplicacion/crear-duenio.caso-de-uso'
import { CrearGatoCasoDeUso } from './aplicacion/crear-gato.caso-de-uso'
import { DarDeBajaDuenioCasoDeUso } from './aplicacion/dar-de-baja-duenio.caso-de-uso'
import { ListarGatosCasoDeUso } from './aplicacion/listar-gatos.caso-de-uso'
import { CREAR_DUENIO_CASO_DE_USO } from './aplicacion/puertos/crear-duenio.caso-de-uso'
import { CREAR_GATO_CASO_DE_USO } from './aplicacion/puertos/crear-gato.caso-de-uso'
import { DAR_DE_BAJA_DUENIO_CASO_DE_USO } from './aplicacion/puertos/dar-de-baja-duenio.caso-de-uso'
import { LISTAR_GATOS_CASO_DE_USO } from './aplicacion/puertos/listar-gatos.caso-de-uso'
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
    { provide: CREAR_DUENIO_CASO_DE_USO, useClass: CrearDuenioCasoDeUso },
    { provide: DAR_DE_BAJA_DUENIO_CASO_DE_USO, useClass: DarDeBajaDuenioCasoDeUso },
    { provide: CREAR_GATO_CASO_DE_USO, useClass: CrearGatoCasoDeUso },
    { provide: LISTAR_GATOS_CASO_DE_USO, useClass: ListarGatosCasoDeUso },
    { provide: DUENIO_REPOSITORY, useClass: DuenioRepository },
    { provide: GATO_REPOSITORY, useClass: GatoRepository },
  ],
  // Turnos necesita saber si un gato existe.
  exports: [GATO_REPOSITORY],
})
export class PacientesModule {}
