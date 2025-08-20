export enum UserType {
  ADMIN_MAIN = 'ADMIN_MAIN',
  ADMIN_SUB = 'ADMIN_SUB',
  USER = 'USER',
}

export interface User {
  userName: string;
  userType: UserType;
}