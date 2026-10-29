import type { Gato } from '../../dominio/gato'

export class GatoResponse {
  private constructor(
    readonly id: number,
    readonly nombre: string,
    readonly nacimiento: string,
    readonly alergias: string,
    readonly duenioId: number | null,
    readonly enAdopcion: boolean,
  ) {}

  static desde(gato: Gato): GatoResponse {
    return new GatoResponse(gato.id, gato.nombre, gato.nacimiento, gato.alergias, gato.duenioId, gato.enAdopcion)
  }
}
