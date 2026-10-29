import { Column, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, type Relation } from 'typeorm'
import { GatoEntity } from './gato.entity'

// Cómo se guarda un dueño en la tabla duenios. Es distinta de la entidad del dominio a propósito.
@Entity('duenios')
export class DuenioEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  nombre: string

  @Column({ unique: true })
  email: string

  // Borrado lógico: softDelete pone la fecha y las búsquedas lo saltean solas.
  // Es el único null del dueño: vacío quiere decir que sigue activo.
  @DeleteDateColumn({ name: 'borrado_en' })
  borradoEn: Date | null

  // Relation evita un problema de imports circulares entre entidades.
  @OneToMany(
    () => GatoEntity,
    (gato) => gato.duenio,
  )
  gatos: Relation<GatoEntity[]>
}
