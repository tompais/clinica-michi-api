import { Body, Controller, Delete, HttpCode, HttpStatus, Param, ParseIntPipe, Post } from '@nestjs/common'
import { CrearDuenioCasoDeUso } from '../../aplicacion/crear-duenio.caso-de-uso'
import { DarDeBajaDuenioCasoDeUso } from '../../aplicacion/dar-de-baja-duenio.caso-de-uso'
import { CrearDuenioDto } from './dto/crear-duenio.dto'
import { DuenioRespuestaDto } from './dto/duenio-respuesta.dto'

// Adaptador de entrada: traduce HTTP a casos de uso. No tiene reglas de negocio.
@Controller('duenios')
export class DueniosController {
  constructor(
    private readonly crearDuenio: CrearDuenioCasoDeUso,
    private readonly darDeBajaDuenio: DarDeBajaDuenioCasoDeUso,
  ) {}

  @Post()
  async crear(@Body() dto: CrearDuenioDto): Promise<DuenioRespuestaDto> {
    return DuenioRespuestaDto.desde(await this.crearDuenio.ejecutar(dto))
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  darDeBaja(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.darDeBajaDuenio.ejecutar(id)
  }
}
