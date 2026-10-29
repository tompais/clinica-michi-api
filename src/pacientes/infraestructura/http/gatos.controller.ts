import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { CrearGatoCasoDeUso } from '../../aplicacion/crear-gato.caso-de-uso'
import { ListarGatosCasoDeUso } from '../../aplicacion/listar-gatos.caso-de-uso'
import { CrearGatoRequestBody } from './crear-gato.request-body'
import { GatoResponse } from './gato.response'
import { ListarGatosQuery } from './listar-gatos.query'

@Controller('gatos')
export class GatosController {
  constructor(
    private readonly crearGato: CrearGatoCasoDeUso,
    private readonly listarGatos: ListarGatosCasoDeUso,
  ) {}

  @Get()
  async listar(@Query() query: ListarGatosQuery): Promise<readonly GatoResponse[]> {
    const gatos = await this.listarGatos.ejecutar(query)
    return gatos.map(GatoResponse.desde)
  }

  @Post()
  async crear(@Body() body: CrearGatoRequestBody): Promise<GatoResponse> {
    return GatoResponse.desde(await this.crearGato.ejecutar(body))
  }
}
