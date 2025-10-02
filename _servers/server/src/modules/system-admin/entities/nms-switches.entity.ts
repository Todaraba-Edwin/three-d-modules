import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('NMS_TN_SWITCHES')
export class NMS_TN_SWITCHES {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 100 })
  switch_name: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  ip_address: string;

  @Column({ type: 'varchar', length: 100 })
  community: string;

  @Column({ type: 'bigint', nullable: true })
  model_id: number;

  @Column({ type: 'bigint', nullable: true })
  building_id: number;

  @Column({ type: 'bigint', nullable: true })
  floor_id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
