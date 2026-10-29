import type { Turno } from './turno'

// Puerto: lo que el dominio necesita para guardar y buscar turnos.
export interface ITurnoRepository {
  guardar(turno: Turno): Promise<void>
  // Devuelve el turno o tira NoEncontrado.
  obtener(id: string): Promise<Turno>
  // Un horario está ocupado si ya hay un turno que no está cancelado.
  estaOcupado(fechaHora: Date): Promise<boolean>
  // Desde incluido, hasta excluido.
  buscarEntre(desde: Date, hasta: Date): Promise<readonly Turno[]>
}

// La interfaz se borra al compilar. El Symbol queda: es la credencial para inyectarla.
export const TURNO_REPOSITORY = Symbol('TURNO_REPOSITORY')
