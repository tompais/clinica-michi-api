import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PacientesModule } from '../pacientes/pacientes.module'
import { CancelarTurnoCasoDeUso } from './aplicacion/cancelar-turno.caso-de-uso'
import { ListarTurnosDelDiaCasoDeUso } from './aplicacion/listar-turnos-del-dia.caso-de-uso'
import { CANCELAR_TURNO_CASO_DE_USO } from './aplicacion/puertos/cancelar-turno.caso-de-uso'
import { LISTAR_TURNOS_DEL_DIA_CASO_DE_USO } from './aplicacion/puertos/listar-turnos-del-dia.caso-de-uso'
import { RESERVAR_TURNO_CASO_DE_USO } from './aplicacion/puertos/reservar-turno.caso-de-uso'
import { ReservarTurnoCasoDeUso } from './aplicacion/reservar-turno.caso-de-uso'
import { AVISADOR } from './dominio/avisador'
import { TURNO_REPOSITORY } from './dominio/turno.repository'
import { MailAvisador } from './infraestructura/avisos/mail.avisador'
import { TurnosController } from './infraestructura/http/turnos.controller'
import { TurnoEntity } from './infraestructura/persistencia/turno.entity'
import { TurnoRepository } from './infraestructura/persistencia/turno.repository'

// El módulo conecta cada puerto con su adaptador. Cambiar de adaptador es cambiar una línea acá.
@Module({
  imports: [TypeOrmModule.forFeature([TurnoEntity]), PacientesModule],
  controllers: [TurnosController],
  providers: [
    { provide: RESERVAR_TURNO_CASO_DE_USO, useClass: ReservarTurnoCasoDeUso },
    { provide: CANCELAR_TURNO_CASO_DE_USO, useClass: CancelarTurnoCasoDeUso },
    { provide: LISTAR_TURNOS_DEL_DIA_CASO_DE_USO, useClass: ListarTurnosDelDiaCasoDeUso },
    { provide: TURNO_REPOSITORY, useClass: TurnoRepository },
    { provide: AVISADOR, useClass: MailAvisador },
  ],
  // Recordatorios usa los mismos puertos.
  exports: [TURNO_REPOSITORY, AVISADOR],
})
export class TurnosModule {}
