import { Transform } from 'class-transformer'
import { IsDate } from 'class-validator'

// Los query params de GET /turnos. Por ejemplo: GET /turnos?fecha=2030-11-05
export class ListarTurnosQuery {
  // Llega como texto. Se toma el día desde las 00:00 de la hora local, para que la zona horaria no lo corra.
  @Transform(({ value }) => new Date(`${value}T00:00:00`))
  @IsDate()
  readonly fecha: Date
}
