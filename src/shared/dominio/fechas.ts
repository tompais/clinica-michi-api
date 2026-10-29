// Cuentas con fechas que usan el dominio, los casos de uso y los tests.
const MILISEGUNDOS_POR_HORA = 60 * 60 * 1000

export function sumarHoras(fecha: Date, horas: number): Date {
  return new Date(fecha.getTime() + horas * MILISEGUNDOS_POR_HORA)
}

export function horasEntre(desde: Date, hasta: Date): number {
  return (hasta.getTime() - desde.getTime()) / MILISEGUNDOS_POR_HORA
}

// La fecha de dentro de unos días, a una hora en punto. Por ejemplo, mañana a las 10.
export function diasDespues(fecha: Date, dias: number, hora = 0): Date {
  const resultado = new Date(fecha)
  resultado.setDate(resultado.getDate() + dias)
  resultado.setHours(hora, 0, 0, 0)
  return resultado
}
