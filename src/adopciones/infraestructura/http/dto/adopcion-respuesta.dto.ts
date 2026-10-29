import type { Adopcion } from '../../../dominio/adopcion'

export class AdopcionRespuestaDto {
  private constructor(
    readonly id: number,
    readonly gatoId: number,
    readonly duenioId: number,
    readonly fecha: Date,
  ) {}

  static desde(adopcion: Adopcion): AdopcionRespuestaDto {
    return new AdopcionRespuestaDto(adopcion.id, adopcion.gatoId, adopcion.duenioId, adopcion.fecha)
  }
}
