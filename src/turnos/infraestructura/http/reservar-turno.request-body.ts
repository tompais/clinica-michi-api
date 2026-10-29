import { Type } from 'class-transformer'
import { IsDate, IsInt, IsNotEmpty, IsString } from 'class-validator'

// El cuerpo del pedido para reservar un turno. Una clase con sus validaciones, nada de tipos anónimos.
export class ReservarTurnoRequestBody {
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
