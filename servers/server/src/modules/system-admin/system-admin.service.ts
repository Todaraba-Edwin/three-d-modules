import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { USER_TN_USERS } from '../users/dto';
import { Repository } from 'typeorm';
import {
  NMS_TC_MANUFACTURERS,
  NMS_TC_SWITCH_MODELS,
  NMS_TN_DEVICES,
  NMS_TN_SWITCHES,
  SummaryResDto,
} from './dto';

@Injectable()
export class SystemAdminService {
  constructor(
    @InjectRepository(USER_TN_USERS)
    private usersRepository: Repository<USER_TN_USERS>,
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
}
