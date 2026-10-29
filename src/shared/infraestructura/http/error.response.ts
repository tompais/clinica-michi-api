// Lo que vuelve cuando el dominio rechaza un pedido.
export class ErrorResponse {
  constructor(
    readonly statusCode: number,
    readonly mensaje: string,
  ) {}
}
