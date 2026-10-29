import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm'

// Cómo se guarda una adopción en la tabla adopciones.
@Entity('adopciones')
export class AdopcionEntity {
  @PrimaryGeneratedColumn()
  id: number

  // UNIQUE en la base: un gato se adopta una sola vez.
  @Column({ name: 'gato_id', unique: true })
  gatoId: number

  @Column({ name: 'duenio_id' })
  duenioId: number

  @CreateDateColumn({ type: 'timestamptz' })
  fecha: Date
}
