import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PacientesModule } from '../pacientes/pacientes.module'
import { CancelarTurnoCasoDeUso } from './aplicacion/cancelar-turno.caso-de-uso'
import { ReservarTurnoCasoDeUso } from './aplicacion/reservar-turno.caso-de-uso'
import { AVISADOR } from './dominio/avisador'
import { TURNO_REPOSITORY } from './dominio/turno.repository'
import { MailAvisador } from './infraestructura/avisos/mail.avisador'
import { TurnosController } from './infraestructura/http/turnos.controller'
import { TurnoEntity } from './infraestructura/persistencia/turno.entity'
import { TypeOrmTurnoRepository } from './infraestructura/persistencia/typeorm-turno.repository'

// El módulo conecta cada puerto con su adaptador. Cambiar de adaptador es cambiar una línea acá.
@Module({
  imports: [TypeOrmModule.forFeature([TurnoEntity]), PacientesModule],
  controllers: [TurnosController],
  providers: [
    ReservarTurnoCasoDeUso,
    CancelarTurnoCasoDeUso,
    { provide: TURNO_REPOSITORY, useClass: TypeOrmTurnoRepository },
    { provide: AVISADOR, useClass: MailAvisador },
  ],
  // Recordatorios usa los mismos puertos.
  exports: [TURNO_REPOSITORY, AVISADOR],
})
export class TurnosModule {}
