import type { MigrationInterface, QueryRunner } from 'typeorm'

// Una migración nueva para un cambio nuevo. La de arriba ya corrió: no se toca más.
// Agregar una columna con valor por defecto es seguro: las filas viejas quedan con texto vacío
// y la versión vieja de la app ni se entera.
export class AgregarAlergias1730000000001 implements MigrationInterface {
  async up(q: QueryRunner): Promise<void> {
    await q.query(`ALTER TABLE gatos ADD COLUMN alergias TEXT NOT NULL DEFAULT ''`)
  }

  async down(q: QueryRunner): Promise<void> {
    await q.query(`ALTER TABLE gatos DROP COLUMN alergias`)
  }
}
