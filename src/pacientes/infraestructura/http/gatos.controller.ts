import { Body, Controller, Get, Post } from '@nestjs/common'
import { CrearGatoCasoDeUso } from '../../aplicacion/crear-gato.caso-de-uso'
import { ListarGatosCasoDeUso } from '../../aplicacion/listar-gatos.caso-de-uso'
import { CrearGatoDto } from './dto/crear-gato.dto'
import { GatoRespuestaDto } from './dto/gato-respuesta.dto'

@Controller('gatos')
export class GatosController {
  constructor(
    private readonly crearGato: CrearGatoCasoDeUso,
    private readonly listarGatos: ListarGatosCasoDeUso,
  ) {}

  @Get()
  async listar(): Promise<readonly GatoRespuestaDto[]> {
    const gatos = await this.listarGatos.ejecutar()
    return gatos.map(GatoRespuestaDto.desde)
  }

  @Post()
  async crear(@Body() dto: CrearGatoDto): Promise<GatoRespuestaDto> {
    return GatoRespuestaDto.desde(await this.crearGato.ejecutar(dto))
  }
}
