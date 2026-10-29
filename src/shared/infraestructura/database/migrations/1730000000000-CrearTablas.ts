import type { MigrationInterface, QueryRunner } from 'typeorm'

// Primera migración: el archivo de la clínica.
// up crea las tablas. down las borra, en el orden inverso.
export class CrearTablas1730000000000 implements MigrationInterface {
  async up(q: QueryRunner): Promise<void> {
    await q.query(`
      CREATE TABLE duenios (
        id SERIAL PRIMARY KEY,
        nombre TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        borrado_en TIMESTAMPTZ          -- borrado lógico: con fecha, la ficha está dada de baja
      )`)
    await q.query(`
      CREATE TABLE gatos (
        id SERIAL PRIMARY KEY,
        nombre TEXT NOT NULL,
        nacimiento DATE NOT NULL,
        adoptado BOOLEAN NOT NULL DEFAULT false,
        -- NULL a propósito: un gato sin dueño está en adopción.
        -- RESTRICT: no se puede borrar un dueño que todavía tiene gatos.
        duenio_id INT REFERENCES duenios(id) ON DELETE RESTRICT
      )`)
    await q.query(`
      CREATE TABLE turnos (
        id UUID PRIMARY KEY,
        -- CASCADE: si se borra el gato, se borran sus turnos.
        gato_id INT NOT NULL REFERENCES gatos(id) ON DELETE CASCADE,
        fecha_hora TIMESTAMPTZ NOT NULL,
        motivo TEXT NOT NULL,
        estado TEXT NOT NULL DEFAULT 'PENDIENTE'
          CHECK (estado IN ('PENDIENTE', 'CONFIRMADO', 'CANCELADO'))
      )`)
    // Buscamos seguido por fecha: el índice evita revisar la tabla entera.
    await q.query(`CREATE INDEX idx_turnos_fecha ON turnos (fecha_hora)`)
    await q.query(`
      CREATE TABLE adopciones (
        id SERIAL PRIMARY KEY,
        gato_id INT NOT NULL UNIQUE REFERENCES gatos(id) ON DELETE RESTRICT,
        duenio_id INT NOT NULL REFERENCES duenios(id) ON DELETE RESTRICT,
        fecha TIMESTAMPTZ NOT NULL DEFAULT now()
      )`)
  }

  async down(q: QueryRunner): Promise<void> {
    await q.query(`DROP TABLE adopciones`)
    await q.query(`DROP TABLE turnos`)
    await q.query(`DROP TABLE gatos`)
    await q.query(`DROP TABLE duenios`)
  }
}
