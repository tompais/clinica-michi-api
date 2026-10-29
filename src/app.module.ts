import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AdopcionesModule } from './adopciones/adopciones.module'
import { PacientesModule } from './pacientes/pacientes.module'
import { RecordatoriosModule } from './recordatorios/recordatorios.module'
import { opcionesDeBase } from './shared/infraestructura/database/opciones-de-base'
import { MensajeriaModule } from './shared/mensajeria/mensajeria.module'
import { TurnosModule } from './turnos/turnos.module'

// El módulo raíz: junta todos los módulos de la clínica.
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({ useFactory: () => opcionesDeBase() }),
    MensajeriaModule,
    PacientesModule,
    TurnosModule,
    AdopcionesModule,
    RecordatoriosModule,
  ],
})
export class AppModule {}
