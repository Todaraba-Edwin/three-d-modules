import {
  Injectable,
  NotFoundException,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { hash } from 'bcrypt';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { USER_TC_ROLES, USER_TN_USERS, USER_TN_USER_ROLES } from './dto';

@Injectable()
export class UsersService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(USER_TN_USERS)
    private usersRepository: Repository<USER_TN_USERS>,
    @InjectRepository(USER_TC_ROLES)
    private rolesRepository: Repository<USER_TC_ROLES>,
    @InjectRepository(USER_TN_USER_ROLES)
    private userRolesRepository: Repository<USER_TN_USER_ROLES>,
  ) {}

  /**
   * @summary 애플리케이션 시작 시 관리자 계정 확인 및 생성
   * @description 서버가 시작될 때 'admin' 계정이 없으면 기본값으로 생성.
   */
  async onApplicationBootstrap() {
    console.log('✅ MariaDB connection successful. Initializing users...');
    const adminUser = await this.getUserByUsername('admin');

    if (!adminUser) {
      console.log('✅ init User Registering...');
      const adminRole = await this.rolesRepository.findOne({
        where: { role_code: 'ADMIN_MAIN' },
      });
      const subAdminRole = await this.rolesRepository.findOne({
        where: { role_code: 'ADMIN_SUB' },
      });

      if (adminRole) {
        await this.setUser(
          'admin',
          '관리자',
          '1234',
          'admin@test.com',
          adminRole.id,
        );
      }

      if (subAdminRole) {
        await this.setUser(
          'test',
          '테스트계정',
          '1234',
          'admin_test@test.com',
          subAdminRole.id,
        );
      }
      console.log('✅ init User Registered : admin, test');
    }
  }

  /**
   * @summary ID로 사용자 조회
   * @param id - 조회할 사용자의 ID
   * @returns ID에 해당하는 사용자 객체
   * @throws {NotFoundException} 해당 ID의 사용자가 없을 경우
   */
  async getUserById(id: number): Promise<USER_TN_USERS> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found.`);
    }
    return user;
  }

  /**
   * @summary 사용자 이름으로 사용자 조회
   * @param username - 조회할 사용자 이름
   * @returns 사용자 이름에 해당하는 사용자 객체 또는 null
   */
  async getUserByUsername(username: string): Promise<USER_TN_USERS | null> {
    return this.usersRepository.findOne({ where: { username } });
  }

  /**
   * @summary 신규 사용자 생성 및 역할 매핑
   * @description 비밀번호를 해시하여 새로운 사용자를 저장하고, 주어진 roleId로 역할 매핑.
   * @param username - 신규 사용자 이름
   * @param nickname - 신규 사용자 닉네임
   * @param password - 신규 사용자 비밀번호 (해시 처리됨)
   * @param email - 신규 사용자 이메일
   * @param role_id - 매핑할 역할의 ID
   * @returns 생성된 사용자 객체
   */
  async setUser(
    username: string,
    nickname: string,
    password: string,
    email: string,
    role_id: number,
  ): Promise<USER_TN_USERS> {
    const hashedPassword = await hash(password, 10);

    // 1. Create and save user
    const newUser = this.usersRepository.create({
      username,
      nickname,
      password: hashedPassword,
      email,
      role_id,
    });
    const savedUser = await this.usersRepository.save(newUser);

    // 2. Create and save user-role mapping
    const userRoleMapping = this.userRolesRepository.create({
      user_id: savedUser.id,
      role_id,
    });
    await this.userRolesRepository.save(userRoleMapping);

    return savedUser;
  }
}
