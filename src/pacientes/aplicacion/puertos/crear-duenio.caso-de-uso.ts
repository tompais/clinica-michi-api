import type { DatosDeDuenio, Duenio } from '../../dominio/duenio'

// Puerto de entrada: qué sabe hacer la clínica, sin decir cómo. El controller pide esto, nunca la clase.
export interface ICrearDuenioCasoDeUso {
  ejecutar(datos: DatosDeDuenio): Promise<Duenio>
}

// La interfaz se borra al compilar. El Symbol queda: es la credencial para pedirla.
export const CREAR_DUENIO_CASO_DE_USO = Symbol('CREAR_DUENIO_CASO_DE_USO')
