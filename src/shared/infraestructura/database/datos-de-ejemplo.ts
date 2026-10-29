import type { DataSource } from 'typeorm'
import { DuenioEntity } from '../../../pacientes/infraestructura/persistencia/duenio.entity'
import { GatoEntity } from '../../../pacientes/infraestructura/persistencia/gato.entity'

// Datos para probar la API apenas la levantás. Corre con la base en memoria o con CARGAR_EJEMPLOS=true.
// En producción, nunca. Usa los repositorios tipados de cada entidad, sin SQL suelto.
export async function cargarDatosDeEjemplo(db: DataSource): Promise<void> {
  const duenios = db.getRepository(DuenioEntity)
  if ((await duenios.count()) > 0) return // ya estaban cargados: no se duplican al reiniciar

  const [pancho, rita] = await duenios.save([
    duenios.create({ nombre: 'Pancho', email: 'pancho@mail.com' }),
    duenios.create({ nombre: 'Rita', email: 'rita@mail.com' }),
  ])

  const gatos = db.getRepository(GatoEntity)
  await gatos.save([
    gatos.create({ nombre: 'Nube', nacimiento: '2023-03-10', alergias: 'pollo', duenioId: pancho.id }),
    gatos.create({ nombre: 'Tom', nacimiento: '2021-07-01', duenioId: rita.id }),
    gatos.create({ nombre: 'Copito', nacimiento: '2024-01-15', duenioId: null }), // en adopción
  ])
}
