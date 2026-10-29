import { Inject, Injectable } from '@nestjs/common'
import type { DatosDeDuenio, Duenio } from '../dominio/duenio'
import { DUENIO_REPOSITORY, type DuenioRepository } from '../dominio/duenio.repository'

@Injectable()
export class CrearDuenioCasoDeUso {
  constructor(@Inject(DUENIO_REPOSITORY) private readonly duenios: DuenioRepository) {}

  ejecutar(datos: DatosDeDuenio): Promise<Duenio> {
    return this.duenios.crear(datos)
  }
}
