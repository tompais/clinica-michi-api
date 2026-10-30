import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common'
import { CREAR_GATO_CASO_DE_USO, type ICrearGatoCasoDeUso } from '../../aplicacion/puertos/crear-gato.caso-de-uso'
import { type IListarGatosCasoDeUso, LISTAR_GATOS_CASO_DE_USO } from '../../aplicacion/puertos/listar-gatos.caso-de-uso'
import { CrearGatoRequestBody } from './crear-gato.request-body'
import { GatoResponse } from './gato.response'
import { ListarGatosQuery } from './listar-gatos.query'

@Controller('gatos')
export class GatosController {
  constructor(
    @Inject(CREAR_GATO_CASO_DE_USO) private readonly crearGato: ICrearGatoCasoDeUso,
    @Inject(LISTAR_GATOS_CASO_DE_USO) private readonly listarGatos: IListarGatosCasoDeUso,
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
