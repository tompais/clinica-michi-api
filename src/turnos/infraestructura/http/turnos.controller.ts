import { Body, Controller, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post } from '@nestjs/common'
import { CancelarTurnoCasoDeUso } from '../../aplicacion/cancelar-turno.caso-de-uso'
import { ReservarTurnoCasoDeUso } from '../../aplicacion/reservar-turno.caso-de-uso'
import { ReservarTurnoRequestBody } from './reservar-turno.request-body'
import { TurnoResponse } from './turno.response'

// Adaptador de entrada: traduce HTTP a casos de uso. No tiene reglas de negocio.
@Controller('turnos')
export class TurnosController {
  constructor(
    private readonly reservarTurno: ReservarTurnoCasoDeUso,
    private readonly cancelarTurno: CancelarTurnoCasoDeUso,
  ) {}

  @Post()
  async reservar(@Body() body: ReservarTurnoRequestBody): Promise<TurnoResponse> {
    return TurnoResponse.desde(await this.reservarTurno.ejecutar(body))
  }

  @Post(':id/cancelar')
  @HttpCode(HttpStatus.OK)
  async cancelar(@Param('id', ParseUUIDPipe) id: string): Promise<TurnoResponse> {
    return TurnoResponse.desde(await this.cancelarTurno.ejecutar(id))
  }
}
