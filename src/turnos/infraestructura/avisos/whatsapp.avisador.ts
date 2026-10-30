import { Logger } from '@nestjs/common'
import type { Turno } from '../../dominio/turno'

interface MensajeWhatsApp {
  telefono: string
  texto: string
}

export class WhatsAppAvisador {
  private readonly logger = new Logger('WhatsApp')

  async enviar(turno: Turno): Promise<void> {
    const mensaje: MensajeWhatsApp = {
      telefono: '+5491100000000',
      texto: `Hola! Tenés turno el ${turno.fechaHora.toISOString()} por ${turno.motivo}`,
    }
    this.logger.log(`💬 ${mensaje.telefono}: ${mensaje.texto}`)
  }
}
