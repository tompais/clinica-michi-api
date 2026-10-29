import { Body, Controller, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post } from '@nestjs/common'
import { CancelarTurnoCasoDeUso } from '../../aplicacion/cancelar-turno.caso-de-uso'
import { ReservarTurnoCasoDeUso } from '../../aplicacion/reservar-turno.caso-de-uso'
import { ReservarTurnoDto } from './dto/reservar-turno.dto'
import { TurnoRespuestaDto } from './dto/turno-respuesta.dto'

// Adaptador de entrada: traduce HTTP a casos de uso. No tiene reglas de negocio.
@Controller('turnos')
export class TurnosController {
  constructor(
    private readonly reservarTurno: ReservarTurnoCasoDeUso,
    private readonly cancelarTurno: CancelarTurnoCasoDeUso,
  ) {}

  @Post()
  async reservar(@Body() dto: ReservarTurnoDto): Promise<TurnoRespuestaDto> {
    return TurnoRespuestaDto.desde(await this.reservarTurno.ejecutar(dto))
  }

  @Post(':id/cancelar')
  @HttpCode(HttpStatus.OK)
  async cancelar(@Param('id', ParseUUIDPipe) id: string): Promise<TurnoRespuestaDto> {
    return TurnoRespuestaDto.desde(await this.cancelarTurno.ejecutar(id))
  }
}
