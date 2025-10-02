import {
  ConflictException,
  Injectable,
  NotFoundException,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { hash } from 'bcrypt';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { API_MESSAGES, ResultDto } from '../_api';
import * as Dto from './dto';
import * as Entities from './entities';

@Injectable()
export class UsersService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Entities.USER_TN_USERS)
    private usersRepository: Repository<Entities.USER_TN_USERS>,
    @InjectRepository(Entities.USER_TC_ROLES)
    private rolesRepository: Repository<Entities.USER_TC_ROLES>,
    @InjectRepository(Entities.USER_TN_USER_ROLES)
    private userRolesRepository: Repository<Entities.USER_TN_USER_ROLES>,
    @InjectRepository(Entities.USER_TN_ROLE_MENU_PERMISSIONS)
    private userMenuPermissionsRepository: Repository<Entities.USER_TN_ROLE_MENU_PERMISSIONS>,
    @InjectRepository(Entities.USER_TC_MENUS)
    private menusRepository: Repository<Entities.USER_TC_MENUS>,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    console.info('✅ MariaDB connection successful. Initializing users...');
    const adminUser = await this.getUserByUsername('admin');

    if (!adminUser) {
      console.info('✅ init User Registering...');
      const adminRole = await this.rolesRepository.findOne({
        where: { role_code: 'ADMIN_MAIN' },
      });
      const subAdminRole = await this.rolesRepository.findOne({
        where: { role_code: 'ADMIN_SUB' },
      });

      const userRole = await this.rolesRepository.findOne({
        where: { role_code: 'USER' },
      });

      if (adminRole) {
        await this.setUser(
          'admin',
          '최고관리자',
          '1234',
          'admin@test.com',
          adminRole.id,
        );
      }

      if (subAdminRole) {
        await this.setUser(
          'test',
          '중간관리자',
          '1234',
          'admin_test@test.com',
          subAdminRole.id,
        );
      }

      if (userRole) {
        await this.setUser(
          'user',
          '일반 사용자',
          '1234',
          'admin_user@test.com',
          userRole.id,
        );
      }
      console.info('✅ init User Registered : admin, test');
    }
  }

  async getAllUsersWithRoles(
    roleId?: number,
  ): Promise<Dto.FindAllUsersResultDto> {
    const query = this.usersRepository
      .createQueryBuilder('user')
      .select([
        'user.id AS id',
        'user.username AS username',
        'user.nickname AS nickname',
        'user.email AS email',
        'user.last_login_at AS last_login_at',
        'role.role_code AS role_code',
        'role.role_name AS role_name',
      ])
      .leftJoin('USER_TC_ROLES', 'role', 'role.id = user.role_id');

    if (roleId) {
      query.where('user.role_id = :roleId', { roleId });
    }

    const users = await query.getRawMany();
    return { message: API_MESSAGES.USERS.GET_ALL_USERS, data: users };
  }

  async deleteUsers(userIds: number[]): Promise<Dto.DeleteUsersResultDto> {
    const result = await this.usersRepository.delete(userIds);
    return { message: API_MESSAGES.USERS.DELETE_USERS, data: result };
  }

  async getUserById(id: number): Promise<Entities.USER_TN_USERS> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found.`);
    }
    return user;
  }

  async getUserByUsername(
    username: string,
  ): Promise<Entities.USER_TN_USERS | null> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async checkUsername(username: string): Promise<ResultDto> {
    const existingUser = await this.usersRepository.findOne({
      where: { username },
    });

    if (existingUser) {
      throw new ConflictException(
        `"${username}"은/는 이미 사용 중에 있습니다.`,
      );
    }
    return { message: API_MESSAGES.USERS.VALID_USERNAME };
  }

  async checkEmail(email: string): Promise<ResultDto> {
    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException(`"${email}"은/는 이미 사용 중에 있습니다.`);
    }
    return { message: API_MESSAGES.USERS.VALID_EMAIL };
  }

  async createUser(
    userDto: Dto.CreateUserReqDto,
  ): Promise<Dto.CreateUserResultDto> {
    const { username, email, nickname, password, role_id } = userDto;

    await this.checkUsername(username);
    await this.checkEmail(email);

    const hashedPassword = await hash(password, 10);

    const newUser = this.usersRepository.create({
      username,
      nickname,
      password: hashedPassword,
      email,
      role_id,
    });

    const savedUser = await this.usersRepository.save(newUser);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...result } = savedUser;
    return { message: API_MESSAGES.USERS.CREATE_USER, data: result };
  }

  async setUser(
    username: string,
    nickname: string,
    password: string,
    email: string,
    role_id: number,
  ): Promise<Entities.USER_TN_USERS> {
    const hashedPassword = await hash(password, 10);

    const newUser = this.usersRepository.create({
      username,
      nickname,
      password: hashedPassword,
      email,
      role_id,
    });
    const savedUser = await this.usersRepository.save(newUser);

    const userRoleMapping = this.userRolesRepository.create({
      user_id: savedUser.id,
      role_id,
    });
    await this.userRolesRepository.save(userRoleMapping);

    return savedUser;
  }

  async getRoleCodeByRoleId(
    role_id: number,
  ): Promise<Entities.USER_TC_ROLES | null> {
    if (role_id === null || role_id === undefined) return null;
    return this.rolesRepository.findOne({ where: { id: role_id } });
  }

  async getMenuPermissionByRoleId(role_id: number): Promise<
    {
      id: number;
      label: string;
      path: string;
      icon_name: string;
      parent_id: number | null;
      sort_order: number;
      can_access: boolean;
    }[]
  > {
    if (role_id === null || role_id === undefined) {
      return [];
    }

    const permissions = await this.menusRepository
      .createQueryBuilder('menu')
      .select([
        'menu.id AS id',
        'menu.label AS label',
        'menu.path AS path',
        'menu.icon_name AS icon_name',
        'menu.parent_id AS parent_id',
        'menu.sort_order AS sort_order',
      ])
      .addSelect('permission.can_access', 'can_access')
      .leftJoin(
        'USER_TN_ROLE_MENU_PERMISSIONS',
        'permission',
        'permission.menu_id = menu.id AND permission.role_id = :role_id',
        { role_id },
      )
      .where('menu.is_active = :is_active', { is_active: true })
      .orderBy('menu.sort_order', 'ASC')
      .getRawMany();

    return permissions.map(
      ({ id, label, path, icon_name, sort_order, parent_id, can_access }) => ({
        id: parseInt(id, 10),
        label,
        path,
        icon_name,
        parent_id: parseInt(parent_id, 10) || null,
        sort_order,
        can_access: can_access === 1 || can_access === true,
      }),
    );
  }

  async upsertRoleWithPermissions(
    payload: Dto.UpsertRoleReqDto,
  ): Promise<Dto.UpsertRoleResultDto> {
    const result = await this.rolesRepository.manager.transaction(
      async (transactionalEntityManager) => {
        let role =
          typeof payload.role_id === 'number' &&
          (await transactionalEntityManager.findOne(Entities.USER_TC_ROLES, {
            where: { id: payload.role_id },
          }));

        if (role) {
          role.role_code = payload.role_code;
          role.role_name = payload.role_name;
          role.role_description = payload.role_description;
        } else {
          role = transactionalEntityManager.create(Entities.USER_TC_ROLES, {
            role_code: payload.role_code,
            role_name: payload.role_name,
            role_description: payload.role_description,
          });
        }
        const savedRole = await transactionalEntityManager.save(role);
        const role_id = savedRole.id;

        await transactionalEntityManager.delete(
          Entities.USER_TN_ROLE_MENU_PERMISSIONS,
          {
            role_id,
          },
        );

        if (payload.menu_permissions && payload.menu_permissions.length > 0) {
          const permissionsToInsert = payload.menu_permissions.map(
            (permission) => ({
              role_id,
              menu_id: permission.menu_id,
              can_access: permission.menu_can_access,
            }),
          );

          const newPermissions = transactionalEntityManager.create(
            Entities.USER_TN_ROLE_MENU_PERMISSIONS,
            permissionsToInsert,
          );
          await transactionalEntityManager.save(newPermissions);
        }

        return savedRole;
      },
    );

    return { message: API_MESSAGES.USERS.UPSERT_ROLE, data: result };
  }

  async updateLastLogin(userId: number): Promise<void> {
    await this.usersRepository.update(userId, {
      last_login_at: new Date(),
    });
  }
}
