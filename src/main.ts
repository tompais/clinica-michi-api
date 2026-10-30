import 'reflect-metadata'
import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DataSource } from 'typeorm'
import { AppModule } from './app.module'
import {
  ENVIAR_RECORDATORIOS_CASO_DE_USO,
  type IEnviarRecordatoriosCasoDeUso,
} from './recordatorios/aplicacion/puertos/enviar-recordatorios.caso-de-uso'
import { Rol } from './shared/configuracion/rol'
import { cargarDatosDeEjemplo } from './shared/infraestructura/database/datos-de-ejemplo'
import { usaBaseEnMemoria } from './shared/infraestructura/database/opciones-de-base'
import { configurarApp } from './shared/infraestructura/http/configurar-app'

const PUERTO_POR_DEFECTO = 3000

// Cloud Run Job: arranca, hace su tarea y termina. No escucha pedidos.
async function correrJobDeRecordatorios(): Promise<void> {
  const app = await NestFactory.createApplicationContext(AppModule)
  await app.get<IEnviarRecordatoriosCasoDeUso>(ENVIAR_RECORDATORIOS_CASO_DE_USO).ejecutar(new Date())
  await app.close()
}

// Cloud Run Service: queda escuchando pedidos HTTP.
async function levantarApi(): Promise<void> {
  const app = configurarApp(await NestFactory.create(AppModule))
  const conEjemplos = usaBaseEnMemoria() || process.env.CARGAR_EJEMPLOS === 'true'
  if (conEjemplos) await cargarDatosDeEjemplo(app.get(DataSource))

  const puerto = Number(process.env.PORT ?? PUERTO_POR_DEFECTO)
  await app.listen(puerto)
  const aclaracion = usaBaseEnMemoria() ? ' (base en memoria)' : ''
  new Logger('Clínica').log(`🐾 API lista en http://localhost:${puerto}/gatos${aclaracion}`)
}

// Una imagen, varios papeles: la misma imagen sirve de API o de job, según ROL.
const rol = (process.env.ROL as Rol | undefined) ?? Rol.API
void (rol === Rol.JOB_RECORDATORIOS ? correrJobDeRecordatorios() : levantarApi())
