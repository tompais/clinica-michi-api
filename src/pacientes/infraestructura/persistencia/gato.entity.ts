import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, type Relation } from 'typeorm'
import type { IGatoGuardado } from '../../dominio/gato'
import { DuenioEntity } from './duenio.entity'

// Cómo se guarda un gato en la tabla gatos.
@Entity('gatos')
export class GatoEntity implements IGatoGuardado {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  nombre: string

  // Una fecha sin hora, como texto: 2023-03-10.
  @Column({ type: 'date' })
  nacimiento: string

  @Column({ default: '' })
  alergias: string

  @Column({ default: false })
  adoptado: boolean

  // null a propósito: un gato sin dueño está en adopción.
  @Column({ name: 'duenio_id', type: 'int', nullable: true })
  duenioId: number | null

  // Muchos gatos, un dueño. La foránea va del lado de los muchos.
  @ManyToOne(
    () => DuenioEntity,
    (duenio) => duenio.gatos,
    { onDelete: 'RESTRICT' },
  )
  @JoinColumn({ name: 'duenio_id' })
  duenio: Relation<DuenioEntity> | null
}
