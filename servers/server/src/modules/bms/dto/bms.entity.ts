import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('BMS_TN_BUILDINGS')
export class Building {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'building_name', type: 'varchar', length: 100, unique: true })
  buildingName: string;

  @Column({ name: 'building_desc', type: 'varchar', length: 255, default: '' })
  buildingDesc: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address: string;

  @Column({
    name: 'building_image',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  buildingImage: string;

  @Column({ type: 'double' })
  latitude: number;

  @Column({ type: 'double' })
  longitude: number;

  @Column({ name: 'ground_floors', type: 'int' })
  groundFloors: number;
}
