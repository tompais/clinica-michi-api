import { Body, Controller, Delete, HttpCode, HttpStatus, Inject, Param, ParseIntPipe, Post } from '@nestjs/common'
import { CREAR_DUENIO_CASO_DE_USO, type ICrearDuenioCasoDeUso } from '../../aplicacion/puertos/crear-duenio.caso-de-uso'
import {
  DAR_DE_BAJA_DUENIO_CASO_DE_USO,
  type IDarDeBajaDuenioCasoDeUso,
} from '../../aplicacion/puertos/dar-de-baja-duenio.caso-de-uso'
import { CrearDuenioRequestBody } from './crear-duenio.request-body'
import { DuenioResponse } from './duenio.response'

// Adaptador de entrada: traduce HTTP a casos de uso. No tiene reglas de negocio.
@Controller('duenios')
export class DueniosController {
  constructor(
    @Inject(CREAR_DUENIO_CASO_DE_USO) private readonly crearDuenio: ICrearDuenioCasoDeUso,
    @Inject(DAR_DE_BAJA_DUENIO_CASO_DE_USO) private readonly darDeBajaDuenio: IDarDeBajaDuenioCasoDeUso,
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
