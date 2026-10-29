import { Body, Controller, Delete, HttpCode, HttpStatus, Param, ParseIntPipe, Post } from '@nestjs/common'
import { CrearDuenioCasoDeUso } from '../../aplicacion/crear-duenio.caso-de-uso'
import { DarDeBajaDuenioCasoDeUso } from '../../aplicacion/dar-de-baja-duenio.caso-de-uso'
import { CrearDuenioRequestBody } from './crear-duenio.request-body'
import { DuenioResponse } from './duenio.response'

// Adaptador de entrada: traduce HTTP a casos de uso. No tiene reglas de negocio.
@Controller('duenios')
export class DueniosController {
  constructor(
    private readonly crearDuenio: CrearDuenioCasoDeUso,
    private readonly darDeBajaDuenio: DarDeBajaDuenioCasoDeUso,
  ) {}

  @Post()
  async crear(@Body() body: CrearDuenioRequestBody): Promise<DuenioResponse> {
    return DuenioResponse.desde(await this.crearDuenio.ejecutar(body))
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  darDeBaja(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.darDeBajaDuenio.ejecutar(id)
  }
}
