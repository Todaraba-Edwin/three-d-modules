import { Column, Entity, PrimaryColumn } from 'typeorm';

const BigintTransformer = {
  to: (value: number | null) => value,
  from: (value: string | null) => {
    if (value === null) {
      return null;
    }
    return parseInt(value, 10);
  },
};

@Entity('USER_TN_ROLE_MENU_PERMISSIONS')
export class USER_TN_ROLE_MENU_PERMISSIONS {
  @PrimaryColumn({ type: 'bigint', transformer: BigintTransformer })
  role_id: number;

  @PrimaryColumn({ type: 'bigint', transformer: BigintTransformer })
  menu_id: number;

  @Column({ type: 'boolean', default: false })
  can_access: boolean;
}
