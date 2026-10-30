import type { DatosDeTurno, Turno } from '../../dominio/turno'

// Puerto de entrada: qué sabe hacer la clínica, sin decir cómo. El controller pide esto, nunca la clase.
export interface IReservarTurnoCasoDeUso {
  ejecutar(datos: DatosDeTurno): Promise<Turno>
}

// La interfaz se borra al compilar. El Symbol queda: es la credencial para pedirla.
export const RESERVAR_TURNO_CASO_DE_USO = Symbol('RESERVAR_TURNO_CASO_DE_USO')
