import { Inject, Injectable } from '@nestjs/common'
import type { DatosDeDuenio, Duenio } from '../dominio/duenio'
import { DUENIO_REPOSITORY, type IDuenioRepository } from '../dominio/duenio.repository'

@Injectable()
export class CrearDuenioCasoDeUso {
  constructor(@Inject(DUENIO_REPOSITORY) private readonly duenios: IDuenioRepository) {}

  ejecutar(datos: DatosDeDuenio): Promise<Duenio> {
    return this.duenios.crear(datos)
  }
}
