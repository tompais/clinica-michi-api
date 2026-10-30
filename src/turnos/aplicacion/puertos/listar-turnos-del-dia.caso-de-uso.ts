import type { Turno } from '../../dominio/turno'

// Puerto de entrada: qué sabe hacer la clínica, sin decir cómo. El controller pide esto, nunca la clase.
export interface IListarTurnosDelDiaCasoDeUso {
  ejecutar(dia: Date): Promise<readonly Turno[]>
}

// La interfaz se borra al compilar. El Symbol queda: es la credencial para pedirla.
export const LISTAR_TURNOS_DEL_DIA_CASO_DE_USO = Symbol('LISTAR_TURNOS_DEL_DIA_CASO_DE_USO')
