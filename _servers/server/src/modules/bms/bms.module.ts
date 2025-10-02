import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth';
import { FilesModule } from '../files/files.module';
import { BmsController } from './bms.controller';
import { BmsService } from './bms.service';
import { Building } from './entities';

@Module({
  imports: [AuthModule, FilesModule, TypeOrmModule.forFeature([Building])],
  controllers: [BmsController],
  providers: [BmsService],
})
export class BmsModule {}
