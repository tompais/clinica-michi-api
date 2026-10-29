import { IsInt } from 'class-validator'

export class AdoptarGatoRequestBody {
  @IsInt()
  readonly gatoId: number

  @IsInt()
  readonly duenioId: number
}
