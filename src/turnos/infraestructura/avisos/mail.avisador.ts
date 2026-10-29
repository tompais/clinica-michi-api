import { Injectable, Logger } from '@nestjs/common'
import type { IAvisador } from '../../dominio/avisador'
import type { Turno } from '../../dominio/turno'

// Adaptador: avisa por mail. En este repo de ejemplo el mail se escribe en la consola.
@Injectable()
export class MailAvisador implements IAvisador {
  private readonly logger = new Logger('Mail')

  async avisarTurnoReservado(turno: Turno): Promise<void> {
    this.logger.log(`📧 Turno reservado para el ${turno.fechaHora.toISOString()}: ${turno.motivo}`)
  }

  async recordarTurno(turno: Turno): Promise<void> {
    this.logger.log(`⏰ Mañana tenés turno, ${turno.fechaHora.toISOString()}: ${turno.motivo}`)
  }
}
