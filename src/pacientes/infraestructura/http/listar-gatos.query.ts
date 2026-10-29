import { Transform } from 'class-transformer'
import { IsBoolean } from 'class-validator'

// Los query params de GET /gatos. Por ejemplo: GET /gatos?enAdopcion=true
export class ListarGatosQuery {
  // En la URL todo llega como texto. Transform convierte 'true' en true antes de validar.
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  readonly enAdopcion: boolean = false
}
