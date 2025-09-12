import {
  Injectable,
  NotFoundException,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { hash } from 'bcrypt';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  USER_TC_MENUS,
  USER_TC_ROLES,
  USER_TN_ROLE_MENU_PERMISSIONS,
  USER_TN_USERS,
  USER_TN_USER_ROLES,
} from './dto';

@Injectable()
export class UsersService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(USER_TN_USERS)
    private usersRepository: Repository<USER_TN_USERS>,
    @InjectRepository(USER_TC_ROLES)
    private rolesRepository: Repository<USER_TC_ROLES>,
    @InjectRepository(USER_TN_USER_ROLES)
    private userRolesRepository: Repository<USER_TN_USER_ROLES>,
    @InjectRepository(USER_TN_ROLE_MENU_PERMISSIONS)
    private userMenuPermissionsRepository: Repository<USER_TN_ROLE_MENU_PERMISSIONS>,
    @InjectRepository(USER_TC_MENUS)
    private menusRepository: Repository<USER_TC_MENUS>,
  ) {}

  /**
   * @summary 애플리케이션 시작 시 관리자 계정 확인 및 생성
   * @description 서버가 시작될 때 'admin' 계정이 없으면 기본값으로 생성.
   */
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

  /**
   * @summary 모든 사용자 정보와 역할 정보를 함께 조회
   * @description 모든 사용자의 목록을 해당 사용자의 역할 이름과 함께 반환합니다.
   * @returns 사용자 목록 (역할 정보 포함)
   */
  async getAllUsersWithRoles(roleId?: number): Promise<any[]> {
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

    return users;
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

  /**
   * @summary DB에 정의된 Role_id에 대한 역할정보 조회
   * @description 주어진 roleId로 역할정보 반환.
   * @param role_id - 매핑할 역할의 ID
   * @returns 조회된 역할정보 객체
   */

  async getRoleCodeByRoleId(role_id: number): Promise<USER_TC_ROLES | null> {
    if (role_id === null || role_id === undefined) return null;
    return this.rolesRepository.findOne({ where: { id: role_id } });
  }

  /**
   * @summary DB에 정의된 Role_id에 대한 역할별 메뉴접근정보 조회
   * @description 주어진 roleId로 역할별 메뉴접근정보 반환.
   * @param role_id - 매핑할 역할의 ID
   * @returns 조회된 역할별 메뉴접근정보 객체
   */

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

  /**
   * @summary 역할 및 메뉴 권한 생성 또는 업데이트
   * @description role_code를 기준으로 역할을 찾아, 있으면 업데이트하고 없으면 생성합니다.
   *              연관된 메뉴 권한도 모두 새로 설정합니다.
   * @param payload - 역할 정보 및 메뉴 권한 데이터
   * @returns 생성 또는 업데이트된 역할 객체
   */
  async upsertRoleWithPermissions(payload: {
    role_id: number | undefined;
    role_code: string;
    role_name: string;
    role_description: string;
    menu_permissions: {
      menu_id: number;
      menu_can_access: boolean;
    }[];
  }): Promise<USER_TC_ROLES> {
    return this.rolesRepository.manager.transaction(
      async (transactionalEntityManager) => {
        // 1. Find existing role or create a new one
        let role =
          typeof payload.role_id === 'number' &&
          (await transactionalEntityManager.findOne(USER_TC_ROLES, {
            where: { id: payload.role_id },
          }));

        console.log('role', role);

        if (role) {
          // Update existing role
          role.role_code = payload.role_code;
          role.role_name = payload.role_name;
          role.role_description = payload.role_description;
        } else {
          // Create new role
          role = transactionalEntityManager.create(USER_TC_ROLES, {
            role_code: payload.role_code,
            role_name: payload.role_name,
            role_description: payload.role_description,
          });
        }
        const savedRole = await transactionalEntityManager.save(role);
        const role_id = savedRole.id;

        // 2. Delete old permissions for this role
        await transactionalEntityManager.delete(USER_TN_ROLE_MENU_PERMISSIONS, {
          role_id,
        });

        // 3. Insert new permissions
        if (payload.menu_permissions && payload.menu_permissions.length > 0) {
          const permissionsToInsert = payload.menu_permissions.map(
            (permission) => ({
              role_id,
              menu_id: permission.menu_id,
              can_access: permission.menu_can_access,
            }),
          );

          // Using create and save for multiple entities
          const newPermissions = transactionalEntityManager.create(
            USER_TN_ROLE_MENU_PERMISSIONS,
            permissionsToInsert,
          );
          await transactionalEntityManager.save(newPermissions);
        }

        return savedRole;
      },
    );
  }

  /**
   * @summary 사용자의 마지막 로그인 시간을 업데이트
   * @param userId - 업데이트할 사용자의 ID
   */
  async updateLastLogin(userId: number): Promise<void> {
    await this.usersRepository.update(userId, {
      last_login_at: new Date(),
    });
  }
}
