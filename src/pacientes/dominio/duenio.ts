// Los datos de un dueño. Abstracta: no se crea sola, la comparten las clases que tienen estos datos.
export abstract class DatosDeDuenio {
  constructor(
    readonly nombre: string,
    readonly email: string,
  ) {}
}

// Entidad del dominio: un dueño ya guardado. Inmutable: sus datos no cambian después de crearse.
export class Duenio extends DatosDeDuenio {
  constructor(
    readonly id: number,
    nombre: string,
    email: string,
  ) {
    super(nombre, email)
  }
}
