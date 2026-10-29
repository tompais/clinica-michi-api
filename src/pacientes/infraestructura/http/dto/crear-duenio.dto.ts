import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

// La forma de los datos que entran para crear un dueño. Nada de tipos anónimos.
export class CrearDuenioDto {
  @IsString()
  @IsNotEmpty()
  readonly nombre: string

  @IsEmail()
  readonly email: string
}
