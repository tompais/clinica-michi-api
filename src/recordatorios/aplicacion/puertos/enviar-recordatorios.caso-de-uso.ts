// Puerto de entrada: qué sabe hacer la clínica, sin decir cómo. El controller pide esto, nunca la clase.
export interface IEnviarRecordatoriosCasoDeUso {
  // Devuelve cuántos recordatorios mandó.
  ejecutar(hoy: Date): Promise<number>
}

// La interfaz se borra al compilar. El Symbol queda: es la credencial para pedirla.
export const ENVIAR_RECORDATORIOS_CASO_DE_USO = Symbol('ENVIAR_RECORDATORIOS_CASO_DE_USO')
