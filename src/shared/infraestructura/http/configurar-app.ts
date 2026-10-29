import { type INestApplication, ValidationPipe } from '@nestjs/common'
import { ErroresDeDominioFilter } from './errores-de-dominio.filter'

// Una sola configuración HTTP para la app y para los tests. Si cambia, cambia en los dos lados.
export function configurarApp(app: INestApplication): INestApplication {
  // whitelist descarta campos que no están en el DTO. transform convierte el JSON en la clase DTO.
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))
  app.useGlobalFilters(new ErroresDeDominioFilter())
  return app
}
