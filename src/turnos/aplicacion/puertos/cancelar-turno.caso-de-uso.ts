import type { Turno } from '../../dominio/turno'

// Puerto de entrada: qué sabe hacer la clínica, sin decir cómo. El controller pide esto, nunca la clase.
export interface ICancelarTurnoCasoDeUso {
  ejecutar(id: string): Promise<Turno>
}

// La interfaz se borra al compilar. El Symbol queda: es la credencial para pedirla.
export const CANCELAR_TURNO_CASO_DE_USO = Symbol('CANCELAR_TURNO_CASO_DE_USO')
