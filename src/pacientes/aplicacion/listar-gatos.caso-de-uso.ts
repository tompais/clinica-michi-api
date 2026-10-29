import { Inject, Injectable } from '@nestjs/common'
import type { Gato } from '../dominio/gato'
import { GATO_REPOSITORY, type IFiltroDeGatos, type IGatoRepository } from '../dominio/gato.repository'

@Injectable()
export class ListarGatosCasoDeUso {
  constructor(@Inject(GATO_REPOSITORY) private readonly gatos: IGatoRepository) {}

  ejecutar(filtro: IFiltroDeGatos): Promise<readonly Gato[]> {
    return this.gatos.listar(filtro)
  }
}
