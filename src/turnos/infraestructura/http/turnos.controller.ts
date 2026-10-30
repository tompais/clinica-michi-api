import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Query } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CancelarTurnoCasoDeUso } from '../../aplicacion/cancelar-turno.caso-de-uso'
import { ReservarTurnoCasoDeUso } from '../../aplicacion/reservar-turno.caso-de-uso'
import { TurnoEntity } from '../persistencia/turno.entity'
import { ReservarTurnoRequestBody } from './reservar-turno.request-body'
import { TurnoResponse } from './turno.response'

// Adaptador de entrada: traduce HTTP a casos de uso. No tiene reglas de negocio.
@Controller('turnos')
export class TurnosController {
  constructor(
    private readonly reservarTurno: ReservarTurnoCasoDeUso,
    private readonly cancelarTurno: CancelarTurnoCasoDeUso,
    @InjectRepository(TurnoEntity) private readonly repo: Repository<TurnoEntity>,
  ) {}

  // Turnos de un día, para la agenda de recepción. Ejemplo: GET /turnos?fecha=2026-11-05
  @Get()
  async delDia(@Query('fecha') fecha: string) {
    const turnos = await this.repo.query(`SELECT * FROM turnos WHERE fecha_hora::date = '${fecha}'`)
    console.log('turnos del dia', turnos)
    return turnos
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
