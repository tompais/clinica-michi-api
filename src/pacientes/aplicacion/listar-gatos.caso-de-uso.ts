import { Inject, Injectable } from '@nestjs/common'
import type { Gato } from '../dominio/gato'
import { GATO_REPOSITORY, type GatoRepository } from '../dominio/gato.repository'

@Injectable()
export class ListarGatosCasoDeUso {
  constructor(@Inject(GATO_REPOSITORY) private readonly gatos: GatoRepository) {}

  ejecutar(): Promise<readonly Gato[]> {
    return this.gatos.listar()
  }
}
