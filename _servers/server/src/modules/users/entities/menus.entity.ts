import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

const BigintTransformer = {
  to: (value: number | null) => value,
  from: (value: string | null) => {
    if (value === null) {
      return null;
    }
    return parseInt(value, 10);
  },
};

@Entity('USER_TC_MENUS')
export class USER_TC_MENUS {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  label: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  path: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  icon_name: string;

  @Column({ type: 'bigint', nullable: true, transformer: BigintTransformer })
  parent_id: number;

  @Column({ type: 'int', default: 0 })
  sort_order: number;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;
}
