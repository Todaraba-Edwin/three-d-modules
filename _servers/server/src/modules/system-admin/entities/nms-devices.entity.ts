import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('NMS_TN_DEVICES')
export class NMS_TN_DEVICES {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 100 })
  device_name: string;

  @Column({ type: 'bigint', nullable: true })
  device_type_id: number;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: true })
  ip_address: string;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: true })
  mac_address: string;

  @Column({ type: 'bigint', nullable: true })
  switch_id: number;

  @Column({ type: 'int', nullable: true })
  port_index: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
