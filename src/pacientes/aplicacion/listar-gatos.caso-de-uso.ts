import { Inject, Injectable } from '@nestjs/common'
import type { Gato } from '../dominio/gato'
import { type FiltroDeGatos, GATO_REPOSITORY, type IGatoRepository } from '../dominio/gato.repository'

@Injectable()
export class ListarGatosCasoDeUso {
  constructor(@Inject(GATO_REPOSITORY) private readonly gatos: IGatoRepository) {}

  ejecutar(filtro: FiltroDeGatos): Promise<readonly Gato[]> {
    return this.gatos.listar(filtro)
  }
}
