import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('NMS_TC_SWITCH_MODELS')
export class NMS_TC_SWITCH_MODELS {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  model_name: string;

  @Column({ type: 'int' })
  port_count: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  manufacturer: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name_oid: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  lldp_find_id_oid: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
