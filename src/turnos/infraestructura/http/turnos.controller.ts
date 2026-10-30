import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Param, ParseUUIDPipe, Post, Query } from '@nestjs/common'
import {
  CANCELAR_TURNO_CASO_DE_USO,
  type ICancelarTurnoCasoDeUso,
} from '../../aplicacion/puertos/cancelar-turno.caso-de-uso'
import {
  type IListarTurnosDelDiaCasoDeUso,
  LISTAR_TURNOS_DEL_DIA_CASO_DE_USO,
} from '../../aplicacion/puertos/listar-turnos-del-dia.caso-de-uso'
import {
  type IReservarTurnoCasoDeUso,
  RESERVAR_TURNO_CASO_DE_USO,
} from '../../aplicacion/puertos/reservar-turno.caso-de-uso'
import { ListarTurnosQuery } from './listar-turnos.query'
import { ReservarTurnoRequestBody } from './reservar-turno.request-body'
import { TurnoResponse } from './turno.response'

// Adaptador de entrada: traduce HTTP a casos de uso. No tiene reglas de negocio.
@Controller('turnos')
export class TurnosController {
  constructor(
    @Inject(RESERVAR_TURNO_CASO_DE_USO) private readonly reservarTurno: IReservarTurnoCasoDeUso,
    @Inject(CANCELAR_TURNO_CASO_DE_USO) private readonly cancelarTurno: ICancelarTurnoCasoDeUso,
    @Inject(LISTAR_TURNOS_DEL_DIA_CASO_DE_USO) private readonly listarTurnosDelDia: IListarTurnosDelDiaCasoDeUso,
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
