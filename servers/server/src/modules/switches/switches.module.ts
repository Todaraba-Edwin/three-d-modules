import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { SwitchesController } from './switches.controller';
import { SwitchesService } from './switches.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000, // 요청 시간 초과 (5초)
      maxRedirects: 5, // 최대 리디렉션 횟수
    }),
  ],
  controllers: [SwitchesController],
  providers: [SwitchesService],
})
export class SwitchesModule {}
