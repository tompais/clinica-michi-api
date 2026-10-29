import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn, type Relation } from 'typeorm'
import { GatoEntity } from '../../../pacientes/infraestructura/persistencia/gato.entity'
import { EstadoTurno } from '../../dominio/estado-turno'

// Cómo se guarda un turno en la tabla turnos.
@Entity('turnos')
export class TurnoEntity {
  // El id lo genera el dominio al reservar, por eso no es autoincremental.
  @PrimaryColumn('uuid')
  id: string

  @Column({ name: 'gato_id' })
  gatoId: number

  @ManyToOne(() => GatoEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'gato_id' })
  gato: Relation<GatoEntity>

  @Index('idx_turnos_fecha')
  @Column({ name: 'fecha_hora', type: 'timestamptz' })
  fechaHora: Date

  @Column()
  motivo: string

  @Column({ type: 'text', default: EstadoTurno.PENDIENTE })
  estado: EstadoTurno
}
