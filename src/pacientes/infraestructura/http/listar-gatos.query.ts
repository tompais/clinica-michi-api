import { Transform } from 'class-transformer'
import { IsBoolean } from 'class-validator'
import type { IFiltroDeGatos } from '../../dominio/gato.repository'

// Los query params de GET /gatos. Por ejemplo: GET /gatos?enAdopcion=true
export class ListarGatosQuery implements IFiltroDeGatos {
  // En la URL todo llega como texto. Transform convierte 'true' en true antes de validar.
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  readonly enAdopcion: boolean = false
}
