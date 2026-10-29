export interface IDatosDeAdopcion {
  readonly gatoId: number
  readonly duenioId: number
}

// Entidad del dominio: la constancia de que un gato encontró casa. Inmutable.
export class Adopcion {
  constructor(
    readonly id: number,
    readonly gatoId: number,
    readonly duenioId: number,
    readonly fecha: Date,
  ) {}
}
