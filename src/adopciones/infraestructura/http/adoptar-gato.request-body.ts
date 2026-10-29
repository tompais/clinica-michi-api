import { IsInt } from 'class-validator'
import type { IDatosDeAdopcion } from '../../dominio/adopcion'

export class AdoptarGatoRequestBody implements IDatosDeAdopcion {
  @IsInt()
  readonly gatoId: number

  @IsInt()
  readonly duenioId: number
}
