import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Query } from '@nestjs/common'
import { CancelarTurnoCasoDeUso } from '../../aplicacion/cancelar-turno.caso-de-uso'
import { ListarTurnosDelDiaCasoDeUso } from '../../aplicacion/listar-turnos-del-dia.caso-de-uso'
import { ReservarTurnoCasoDeUso } from '../../aplicacion/reservar-turno.caso-de-uso'
import { ListarTurnosQuery } from './listar-turnos.query'
import { ReservarTurnoRequestBody } from './reservar-turno.request-body'
import { TurnoResponse } from './turno.response'

// Adaptador de entrada: traduce HTTP a casos de uso. No tiene reglas de negocio.
@Controller('turnos')
export class TurnosController {
  constructor(
    private readonly reservarTurno: ReservarTurnoCasoDeUso,
    private readonly cancelarTurno: CancelarTurnoCasoDeUso,
    private readonly listarTurnosDelDia: ListarTurnosDelDiaCasoDeUso,
  ) {}

  @Get()
  async listar(@Query() query: ListarTurnosQuery): Promise<readonly TurnoResponse[]> {
    const turnos = await this.listarTurnosDelDia.ejecutar(query.fecha)
    return turnos.map(TurnoResponse.desde)
  }

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
