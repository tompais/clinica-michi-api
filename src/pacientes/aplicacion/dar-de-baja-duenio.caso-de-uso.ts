import { Inject, Injectable } from '@nestjs/common'
import { DUENIO_REPOSITORY, type DuenioRepository } from '../dominio/duenio.repository'

@Injectable()
export class DarDeBajaDuenioCasoDeUso {
  constructor(@Inject(DUENIO_REPOSITORY) private readonly duenios: DuenioRepository) {}

  ejecutar(id: number): Promise<void> {
    return this.duenios.darDeBaja(id)
  }
}
