import type { Adopcion, DatosDeAdopcion } from '../../dominio/adopcion'

// Puerto de entrada: qué sabe hacer la clínica, sin decir cómo. El controller pide esto, nunca la clase.
export interface IAdoptarGatoCasoDeUso {
  ejecutar(datos: DatosDeAdopcion): Promise<Adopcion>
}

// La interfaz se borra al compilar. El Symbol queda: es la credencial para pedirla.
export const ADOPTAR_GATO_CASO_DE_USO = Symbol('ADOPTAR_GATO_CASO_DE_USO')
