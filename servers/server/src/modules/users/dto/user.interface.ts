export enum UserType {
  ADMIN_MAIN = 'ADMIN_MAIN',
  ADMIN_SUB = 'ADMIN_SUB',
  USER = 'USER',
}

export class CreateUserDto {
  username: string;
  nickname: string;
  password: string;
  email: string;
  user_type: UserType;
}
