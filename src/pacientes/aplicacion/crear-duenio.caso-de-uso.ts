import { Inject, Injectable } from '@nestjs/common'
import type { DatosDeDuenio, Duenio } from '../dominio/duenio'
import { DUENIO_REPOSITORY, type IDuenioRepository } from '../dominio/duenio.repository'
import type { ICrearDuenioCasoDeUso } from './puertos/crear-duenio.caso-de-uso'

@Injectable()
export class CrearDuenioCasoDeUso implements ICrearDuenioCasoDeUso {
  constructor(@Inject(DUENIO_REPOSITORY) private readonly duenios: IDuenioRepository) {}

  ejecutar(datos: DatosDeDuenio): Promise<Duenio> {
    return this.duenios.crear(datos)
  }
}
