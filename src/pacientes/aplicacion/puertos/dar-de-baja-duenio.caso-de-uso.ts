// Puerto de entrada: qué sabe hacer la clínica, sin decir cómo. El controller pide esto, nunca la clase.
export interface IDarDeBajaDuenioCasoDeUso {
  ejecutar(id: number): Promise<void>
}

// La interfaz se borra al compilar. El Symbol queda: es la credencial para pedirla.
export const DAR_DE_BAJA_DUENIO_CASO_DE_USO = Symbol('DAR_DE_BAJA_DUENIO_CASO_DE_USO')
