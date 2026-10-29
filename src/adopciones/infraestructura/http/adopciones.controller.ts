import { Body, Controller, Post } from '@nestjs/common'
import { AdoptarGatoCasoDeUso } from '../../aplicacion/adoptar-gato.caso-de-uso'
import { AdopcionResponse } from './adopcion.response'
import { AdoptarGatoRequestBody } from './adoptar-gato.request-body'

@Controller('adopciones')
export class AdopcionesController {
  constructor(private readonly adoptarGato: AdoptarGatoCasoDeUso) {}

  @Post()
  async adoptar(@Body() body: AdoptarGatoRequestBody): Promise<AdopcionResponse> {
    return AdopcionResponse.desde(await this.adoptarGato.ejecutar(body))
  }
}
