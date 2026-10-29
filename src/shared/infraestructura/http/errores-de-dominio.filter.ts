import { type ArgumentsHost, Catch, type ExceptionFilter, HttpStatus } from '@nestjs/common'
import type { Response } from 'express'
import { NoEncontrado, ReglaDeNegocioRota } from '../../dominio/errores'

// Traduce los errores del dominio a respuestas HTTP. Así el dominio no sabe nada de HTTP.
@Catch(ReglaDeNegocioRota, NoEncontrado)
export class ErroresDeDominioFilter implements ExceptionFilter {
  catch(error: Error, host: ArgumentsHost): void {
    const res = host.switchToHttp().getResponse<Response>()
    const status = error instanceof NoEncontrado ? HttpStatus.NOT_FOUND : HttpStatus.UNPROCESSABLE_ENTITY
    res.status(status).json({ statusCode: status, mensaje: error.message })
  }
}
