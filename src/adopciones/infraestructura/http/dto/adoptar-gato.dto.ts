import { IsInt } from 'class-validator'

export class AdoptarGatoDto {
  @IsInt()
  readonly gatoId: number

  @IsInt()
  readonly duenioId: number
}
