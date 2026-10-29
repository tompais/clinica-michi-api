import type { Turno } from './turno'

// Puerto: avisarle al dueño. Hoy es un mail, mañana puede ser WhatsApp sin tocar el dominio.
export interface Avisador {
  avisarTurnoReservado(turno: Turno): Promise<void>
  recordarTurno(turno: Turno): Promise<void>
}

export const AVISADOR = Symbol('AVISADOR')
