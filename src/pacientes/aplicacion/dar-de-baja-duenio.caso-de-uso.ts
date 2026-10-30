import { Inject, Injectable } from '@nestjs/common'
import { DUENIO_REPOSITORY, type IDuenioRepository } from '../dominio/duenio.repository'
import type { IDarDeBajaDuenioCasoDeUso } from './puertos/dar-de-baja-duenio.caso-de-uso'

@Injectable()
export class DarDeBajaDuenioCasoDeUso implements IDarDeBajaDuenioCasoDeUso {
  constructor(@Inject(DUENIO_REPOSITORY) private readonly duenios: IDuenioRepository) {}

  ejecutar(id: number): Promise<void> {
    return this.duenios.darDeBaja(id)
  }
}
