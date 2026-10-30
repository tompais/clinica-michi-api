import type { DatosDeGato, Gato } from '../../dominio/gato'

// Puerto de entrada: qué sabe hacer la clínica, sin decir cómo. El controller pide esto, nunca la clase.
export interface ICrearGatoCasoDeUso {
  ejecutar(datos: DatosDeGato): Promise<Gato>
}

// La interfaz se borra al compilar. El Symbol queda: es la credencial para pedirla.
export const CREAR_GATO_CASO_DE_USO = Symbol('CREAR_GATO_CASO_DE_USO')
