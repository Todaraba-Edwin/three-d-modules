import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('USER_TC_ROLES')
export class USER_TC_ROLES {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  role_code: string;

  @Column({ type: 'varchar', length: 100 })
  role_name: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  role_description: string;
}
