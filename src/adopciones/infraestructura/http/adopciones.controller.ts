import { Body, Controller, Inject, Post } from '@nestjs/common'
import { ADOPTAR_GATO_CASO_DE_USO, type IAdoptarGatoCasoDeUso } from '../../aplicacion/puertos/adoptar-gato.caso-de-uso'
import { AdopcionResponse } from './adopcion.response'
import { AdoptarGatoRequestBody } from './adoptar-gato.request-body'

@Controller('adopciones')
export class AdopcionesController {
  constructor(@Inject(ADOPTAR_GATO_CASO_DE_USO) private readonly adoptarGato: IAdoptarGatoCasoDeUso) {}

  @Post()
  async adoptar(@Body() body: AdoptarGatoRequestBody): Promise<AdopcionResponse> {
    return AdopcionResponse.desde(await this.adoptarGato.ejecutar(body))
  }
}
