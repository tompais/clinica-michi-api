// Entidad del dominio: un dueño. Inmutable: sus datos no cambian después de crearse.
export interface DatosDeDuenio {
  readonly nombre: string
  readonly email: string
}

export class Duenio {
  constructor(
    readonly id: number,
    readonly nombre: string,
    readonly email: string,
  ) {}
}
