import { IsEmail, IsNotEmpty, IsString } from 'class-validator'
import type { IDatosDeDuenio } from '../../dominio/duenio'

// El cuerpo del pedido para crear un dueño. Una clase con sus validaciones, nada de tipos anónimos.
export class CrearDuenioRequestBody implements IDatosDeDuenio {
  @IsString()
  @IsNotEmpty()
  readonly nombre: string

  @IsEmail()
  readonly email: string
}
