import {
  Injectable,
  NotFoundException,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { hash } from 'bcrypt';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserType } from './dto';

@Injectable()
export class UsersService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  /**
   * @summary 애플리케이션 시작 시 관리자 계정 확인 및 생성
   * @description 서버가 시작될 때 'admin' 계정이 없으면 기본값으로 생성.
   */
  async onApplicationBootstrap() {
    const adminUser = await this.getUserByUsername('admin');
    if (!adminUser) {
      await this.setUser(
        'admin',
        '1234',
        'admin@test.com',
        UserType.ADMIN_MAIN,
      );
    }
  }

  /**
   * @summary ID로 사용자 조회
   * @param id - 조회할 사용자의 ID
   * @returns ID에 해당하는 사용자 객체
   * @throws {NotFoundException} 해당 ID의 사용자가 없을 경우
   */
  async getUserById(id: number): Promise<User> {
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
  async getUserByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { username } });
  }

  /**
   * @summary 사용자 유형으로 사용자 목록 조회
   * @param userType - 조회할 사용자 유형
   * @returns 해당 유형의 모든 사용자 배열
   */
  async getUsersByUserType(userType: UserType): Promise<User[]> {
    return this.usersRepository.find({ where: { user_type: userType } });
  }

  /**
   * @summary 신규 사용자 생성
   * @description 비밀번호를 해시하여 데이터베이스에 새로운 사용자를 저장.
   * @param username - 신규 사용자 이름
   * @param password - 신규 사용자 비밀번호 (해시 처리됨)
   * @param email - 신규 사용자 이메일
   * @param user_type - 신규 사용자 유형
   * @returns 생성된 사용자 객체
   */
  async setUser(
    username: string,
    password: string,
    email: string,
    user_type: UserType,
  ): Promise<User> {
    const hashedPassword = await hash(password, 10);
    const newUser = this.usersRepository.create({
      username,
      password: hashedPassword,
      email,
      user_type,
    });
    return this.usersRepository.save(newUser);
  }
}
