import { Module } from '@nestjs/common'
import { TurnosModule } from '../turnos/turnos.module'
import { EnviarRecordatoriosCasoDeUso } from './aplicacion/enviar-recordatorios.caso-de-uso'
import { ENVIAR_RECORDATORIOS_CASO_DE_USO } from './aplicacion/puertos/enviar-recordatorios.caso-de-uso'

// Sin controller: este módulo no recibe pedidos HTTP. Lo arranca el job.
@Module({
  imports: [TurnosModule],
  providers: [{ provide: ENVIAR_RECORDATORIOS_CASO_DE_USO, useClass: EnviarRecordatoriosCasoDeUso }],
})
export class RecordatoriosModule {}
