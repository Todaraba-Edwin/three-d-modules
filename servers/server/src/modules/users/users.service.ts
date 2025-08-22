import { Injectable, NotFoundException, OnApplicationBootstrap } from '@nestjs/common';
import { hash } from 'bcrypt';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserType } from './user.entity';

@Injectable()
export class UsersService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async onApplicationBootstrap() {
    const adminUser = await this.findOneByUsername('admin');
    if (!adminUser) {
      await this.createUser('admin', '1234', 'admin@test.com', UserType.ADMIN_MAIN);
      console.log('Admin user created successfully.');
    }
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found.`);
    }
    return user;
  }

  async findOneByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async findByUserType(userType: UserType): Promise<User[]> {
    return this.usersRepository.find({ where: { user_type: userType } });
  }

  async createUser(username: string, password: string, email: string, user_type: UserType): Promise<User> {
    const hashedPassword = await hash(password, 10);
    const newUser = this.usersRepository.create({ username, password: hashedPassword, email, user_type });
    return this.usersRepository.save(newUser);
  }
}
