import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('USER_TN_USER_ROLES')
export class USER_TN_USER_ROLES {
  @PrimaryColumn()
  user_id: number;

  @PrimaryColumn()
  role_id: number;
}
