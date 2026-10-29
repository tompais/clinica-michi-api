import { ReglaDeNegocioRota } from '../../shared/dominio/errores'

export interface IDatosDeGato {
  readonly nombre: string
  readonly nacimiento: string
  readonly alergias: string
  // null a propósito: un gato sin dueño está en adopción.
  readonly duenioId: number | null
}

// Un gato ya guardado: además de sus datos, tiene id y sabe si fue adoptado.
export interface IGatoGuardado extends IDatosDeGato {
  readonly id: number
  readonly adoptado: boolean
}

// Entidad del dominio: un gato con su regla de adopción.
// Inmutable: adoptar no lo modifica, devuelve un gato nuevo con el cambio.
export class Gato {
  private constructor(
    readonly id: number,
    readonly nombre: string,
    readonly nacimiento: string,
    readonly alergias: string,
    readonly duenioId: number | null,
    readonly adoptado: boolean,
  ) {}

  static reconstruir(datos: IGatoGuardado): Gato {
    return new Gato(datos.id, datos.nombre, datos.nacimiento, datos.alergias, datos.duenioId, datos.adoptado)
  }

  get enAdopcion(): boolean {
    return this.duenioId === null && !this.adoptado
  }

  adoptar(duenioId: number): Gato {
    if (!this.enAdopcion) throw new ReglaDeNegocioRota(`${this.nombre} no está en adopción`)
    return new Gato(this.id, this.nombre, this.nacimiento, this.alergias, duenioId, true)
  }
}
