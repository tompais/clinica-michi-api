import type { Adopcion } from '../../dominio/adopcion'

export class AdopcionResponse {
  private constructor(
    readonly id: number,
    readonly gatoId: number,
    readonly duenioId: number,
    readonly fecha: Date,
  ) {}

  static desde(adopcion: Adopcion): AdopcionResponse {
    return new AdopcionResponse(adopcion.id, adopcion.gatoId, adopcion.duenioId, adopcion.fecha)
  }
}
