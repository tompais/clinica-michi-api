import type { Gato } from '../../dominio/gato'
import type { FiltroDeGatos } from '../../dominio/gato.repository'

// Puerto de entrada: qué sabe hacer la clínica, sin decir cómo. El controller pide esto, nunca la clase.
export interface IListarGatosCasoDeUso {
  ejecutar(filtro: FiltroDeGatos): Promise<readonly Gato[]>
}

// La interfaz se borra al compilar. El Symbol queda: es la credencial para pedirla.
export const LISTAR_GATOS_CASO_DE_USO = Symbol('LISTAR_GATOS_CASO_DE_USO')
