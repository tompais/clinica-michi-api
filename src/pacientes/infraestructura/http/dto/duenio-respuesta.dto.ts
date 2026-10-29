import type { Duenio } from '../../../dominio/duenio'

// Lo que sale por HTTP. Separado de la entidad: el dominio puede cambiar sin romper la API.
export class DuenioRespuestaDto {
  private constructor(
    readonly id: number,
    readonly nombre: string,
    readonly email: string,
  ) {}

  static desde(duenio: Duenio): DuenioRespuestaDto {
    return new DuenioRespuestaDto(duenio.id, duenio.nombre, duenio.email)
  }
}
