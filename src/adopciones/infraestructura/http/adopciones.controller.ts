import { Body, Controller, Post } from '@nestjs/common'
import { AdoptarGatoCasoDeUso } from '../../aplicacion/adoptar-gato.caso-de-uso'
import { AdopcionRespuestaDto } from './dto/adopcion-respuesta.dto'
import { AdoptarGatoDto } from './dto/adoptar-gato.dto'

@Controller('adopciones')
export class AdopcionesController {
  constructor(private readonly adoptarGato: AdoptarGatoCasoDeUso) {}

  @Post()
  async adoptar(@Body() dto: AdoptarGatoDto): Promise<AdopcionRespuestaDto> {
    return AdopcionRespuestaDto.desde(await this.adoptarGato.ejecutar(dto))
  }
}
