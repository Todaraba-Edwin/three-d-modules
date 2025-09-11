import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { USER_TC_ROLES, USER_TN_USERS } from '../users/dto';
import {
  NMS_TC_MANUFACTURERS,
  NMS_TC_SWITCH_MODELS,
  NMS_TN_DEVICES,
  NMS_TN_SWITCHES,
  PermissionsByRoleResDto,
  SummaryResDto,
} from './dto';

@Injectable()
export class SystemAdminService {
  constructor(
    @InjectRepository(USER_TN_USERS)
    private usersRepository: Repository<USER_TN_USERS>,
    @InjectRepository(USER_TC_ROLES)
    private rolesRepository: Repository<USER_TC_ROLES>,
    @InjectRepository(NMS_TC_SWITCH_MODELS)
    private switchModelsRepository: Repository<NMS_TC_SWITCH_MODELS>,
    @InjectRepository(NMS_TN_SWITCHES)
    private switchesRepository: Repository<NMS_TN_SWITCHES>,
    @InjectRepository(NMS_TN_DEVICES)
    private devicesRepository: Repository<NMS_TN_DEVICES>,
    @InjectRepository(NMS_TC_MANUFACTURERS)
    private manufacturersRepository: Repository<NMS_TC_MANUFACTURERS>,
  ) {}

  /**
   * @summary 시스템 요약 정보 조회
   * @description 사용자, 스위치 모델, 스위치, 장비의 총 개수를 반환
   * @returns 요약 정보 객체
   */
  async getSummary(): Promise<SummaryResDto> {
    const [
      usersCount,
      switchModelsCount,
      switchesCount,
      devicesCount,
      manufacturersCount,
    ] = await Promise.all([
      this.usersRepository.count(),
      this.switchModelsRepository.count(),
      this.switchesRepository.count(),
      this.devicesRepository.count(),
      this.manufacturersRepository.count(),
    ]);

    return {
      usersCount: usersCount,
      switchModelsCount: switchModelsCount,
      switchesCount: switchesCount,
      devicesCount: devicesCount,
      manufacturersCount: manufacturersCount,
    };
  }

  /**
   * @summary 역할별 메뉴 권한 조회
   * @description 역할별 메뉴 접근 권한 목록을 반환
   * @returns 역할별 메뉴 권한 목록
   */
  async getPermissionsByRole(): Promise<PermissionsByRoleResDto[]> {
    const permissionsByRole = await this.rolesRepository
      .createQueryBuilder('role')
      .select([
        'role.id AS id',
        'role.role_code AS role_code',
        'role.role_name AS role_name',
        'role.role_description AS role_description',
      ])
      .addSelect([
        'permission.menu_id AS menu_id',
        'permission.can_access AS can_access',
        'menu.label AS menu_label',
        'menu.sort_order AS menu_sort_order',
      ])
      .leftJoin(
        'USER_TN_ROLE_MENU_PERMISSIONS',
        'permission',
        'permission.role_id = role.id',
      )
      .leftJoin('USER_TC_MENUS', 'menu', 'menu.id = permission.menu_id')
      .orderBy('role.id', 'ASC')
      .addOrderBy('menu.sort_order', 'ASC')
      .getRawMany();

    const rolesMap = new Map();

    for (const p of permissionsByRole) {
      if (!rolesMap.has(p.role_code)) {
        rolesMap.set(p.role_code, {
          role_id: parseInt(p.id, 10),
          role_code: p.role_code,
          role_name: p.role_name,
          role_description: p.role_description,
          permissionMenu: [],
        });
      }

      if (p.menu_id) {
        rolesMap.get(p.role_code).permissionMenu.push({
          menu_id: parseInt(p.menu_id, 10),
          menu_label: p.menu_label,
          menu_can_access: Boolean(p.can_access),
        });
      }
    }

    return Array.from(rolesMap.values());
  }

  /**
   * @summary 역할 삭제
   * @description 역할 ID 배열을 받아 역할을 삭제합니다. ADMIN_MAIN 역할은 삭제할 수 없습니다.
   *              역할에 할당된 사용자가 있을 경우, force 플래그가 없으면 에러를 반환합니다.
   * @param roleIds 삭제할 역할 ID 배열
   * @param force 강제 삭제 여부
   */
  async deleteRoles(roleIds: number[], force = false): Promise<void> {
    if (!roleIds || roleIds.length === 0) {
      return;
    }

    const roles = await this.rolesRepository.find({
      where: { id: In(roleIds) },
    });

    if (roles.some((role) => role.role_code === 'ADMIN_MAIN')) {
      throw new BadRequestException('ADMIN_MAIN 역할은 삭제할 수 없습니다.');
    }

    const idsToDelete = roles.map((role) => role.id);
    if (idsToDelete.length === 0) {
      return;
    }

    const usersInRoles = await this.usersRepository.find({
      where: { role_id: In(idsToDelete) },
      select: ['id', 'username', 'role_id', 'email'],
    });

    if (usersInRoles.length > 0 && !force) {
      const usersByRoleId = usersInRoles.reduce(
        (acc, user) => {
          const roleId = user.role_id;
          if (!acc[roleId]) {
            acc[roleId] = [];
          }
          acc[roleId].push({
            id: user.id,
            username: user.username,
            email: user.email,
          });
          return acc;
        },
        {} as Record<number, { id: number; username: string; email: string }[]>,
      );

      const rolesWithUsers = roles
        .filter((role) => usersByRoleId[role.id])
        .map((role) => ({
          role_id: role.id,
          role_name: role.role_name,
          user_count: usersByRoleId[role.id].length,
          users: usersByRoleId[role.id],
        }));

      throw new BadRequestException({
        message: 'Cannot delete roles with assigned users.',
        code: 'ROLE_IN_USE',
        details: rolesWithUsers,
      });
    }

    // With ON DELETE CASCADE, users will be deleted automatically.
    await this.rolesRepository.delete(idsToDelete);
  }
}
