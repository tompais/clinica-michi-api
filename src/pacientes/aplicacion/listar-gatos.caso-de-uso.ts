import { Inject, Injectable } from '@nestjs/common'
import type { Gato } from '../dominio/gato'
import { type FiltroDeGatos, GATO_REPOSITORY, type IGatoRepository } from '../dominio/gato.repository'
import type { IListarGatosCasoDeUso } from './puertos/listar-gatos.caso-de-uso'

@Injectable()
export class ListarGatosCasoDeUso implements IListarGatosCasoDeUso {
  constructor(@Inject(GATO_REPOSITORY) private readonly gatos: IGatoRepository) {}

  ejecutar(filtro: FiltroDeGatos): Promise<readonly Gato[]> {
    return this.gatos.listar(filtro)
  }
}
