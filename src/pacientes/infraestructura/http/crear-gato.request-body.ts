import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CrearGatoRequestBody {
  @IsString()
  @IsNotEmpty()
  readonly nombre: string

  @IsDateString()
  readonly nacimiento: string

  // Valor por defecto: si no lo mandan, queda sin alergias. Nunca undefined.
  @IsString()
  readonly alergias: string = ''

  // Sin dueño, el gato queda en adopción.
  @IsOptional()
  @IsInt()
  readonly duenioId: number | null = null

  readonly apodo?: string
}
