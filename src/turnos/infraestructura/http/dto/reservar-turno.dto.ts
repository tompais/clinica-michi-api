import { Type } from 'class-transformer'
import { IsDate, IsInt, IsNotEmpty, IsString } from 'class-validator'

// La forma de los datos que entran para reservar un turno. Nada de tipos anónimos.
export class ReservarTurnoDto {
  @IsInt()
  readonly gatoId: number

  // Llega como texto en el JSON. Type lo convierte en Date antes de validar.
  @Type(() => Date)
  @IsDate()
  readonly fechaHora: Date

  @IsString()
  @IsNotEmpty()
  readonly motivo: string
}
