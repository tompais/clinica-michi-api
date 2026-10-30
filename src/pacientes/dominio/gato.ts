import { ReglaDeNegocioRota } from '../../shared/dominio/errores'

// Los datos de un gato. Abstracta: no se crea sola, la comparten las clases que tienen estos datos.
export abstract class DatosDeGato {
  constructor(
    readonly nombre: string,
    readonly nacimiento: string,
    readonly alergias: string,
    // null a propósito: un gato sin dueño está en adopción.
    readonly duenioId: number | null,
    readonly apodo?: string,
  ) {}
}

// Entidad del dominio: un gato con su regla de adopción.
// Inmutable: adoptar no lo modifica, devuelve un gato nuevo con el cambio.
export class Gato extends DatosDeGato {
  private constructor(
    readonly id: number,
    nombre: string,
    nacimiento: string,
    alergias: string,
    duenioId: number | null,
    readonly adoptado: boolean,
    apodo?: string,
  ) {
    super(nombre, nacimiento, alergias, duenioId, apodo)
  }

  static reconstruir(id: number, datos: DatosDeGato, adoptado: boolean): Gato {
    return new Gato(id, datos.nombre, datos.nacimiento, datos.alergias, datos.duenioId, adoptado, datos.apodo)
  }

  get enAdopcion(): boolean {
    return this.duenioId === null && !this.adoptado
  }

  adoptar(duenioId: number): Gato {
    if (!this.enAdopcion) throw new ReglaDeNegocioRota(`${this.nombre} no está en adopción`)
    return new Gato(this.id, this.nombre, this.nacimiento, this.alergias, duenioId, true)
  }
}
