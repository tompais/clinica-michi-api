// Los datos de una adopción. Abstracta: no se crea sola, la comparten las clases que tienen estos datos.
export abstract class DatosDeAdopcion {
  constructor(
    readonly gatoId: number,
    readonly duenioId: number,
  ) {}
}

// Entidad del dominio: la constancia de que un gato encontró casa. Inmutable.
export class Adopcion extends DatosDeAdopcion {
  constructor(
    readonly id: number,
    gatoId: number,
    duenioId: number,
    readonly fecha: Date,
  ) {
    super(gatoId, duenioId)
  }
}
