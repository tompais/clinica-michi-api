import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

// El cuerpo del pedido para crear un dueño. Una clase con sus validaciones, nada de tipos anónimos.
export class CrearDuenioRequestBody {
  @IsString()
  @IsNotEmpty()
  readonly nombre: string

  @IsEmail()
  readonly email: string
}
