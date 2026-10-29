import type { Gato } from '../../../dominio/gato'

export class GatoRespuestaDto {
  private constructor(
    readonly id: number,
    readonly nombre: string,
    readonly nacimiento: string,
    readonly alergias: string,
    readonly duenioId: number | null,
    readonly enAdopcion: boolean,
  ) {}

  static desde(gato: Gato): GatoRespuestaDto {
    return new GatoRespuestaDto(gato.id, gato.nombre, gato.nacimiento, gato.alergias, gato.duenioId, gato.enAdopcion)
  }
}
