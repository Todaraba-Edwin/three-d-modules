import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Building } from './bms.entity';

export enum FloorType {
  SURFACE = 'SURFACE',
  GROUND = 'GROUND',
  BASEMENT = 'BASEMENT',
}

@Entity('BMS_TN_FLOORS')
export class Floor {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'enum', enum: FloorType, name: 'floor_type' })
  floorType: FloorType;

  @Column({ type: 'int', name: 'floor_number' })
  floorNumber: number;

  @Column({ type: 'varchar', length: 50, name: 'floor_name' })
  floorName: string;

  @Column({ type: 'varchar', length: 255, name: 'floor_desc', nullable: true })
  floorDesc: string;

  @Column({ type: 'varchar', length: 255, name: 'floor_glb' })
  floorGlb: string;

  @Column({ type: 'double' })
  latitude: number;

  @Column({ type: 'double' })
  longitude: number;

  @Column({ type: 'int' })
  height: number;

  @Column({ type: 'int' })
  heading: number;

  @ManyToOne(() => Building, building => building.floors)
  @JoinColumn({ name: 'building_id' })
  building: Building;
}
