import { Inject, Injectable } from '@nestjs/common'
import type { Gato, IDatosDeGato } from '../dominio/gato'
import { GATO_REPOSITORY, type IGatoRepository } from '../dominio/gato.repository'

@Injectable()
export class CrearGatoCasoDeUso {
  constructor(@Inject(GATO_REPOSITORY) private readonly gatos: IGatoRepository) {}

  ejecutar(datos: IDatosDeGato): Promise<Gato> {
    return this.gatos.crear(datos)
  }
}
