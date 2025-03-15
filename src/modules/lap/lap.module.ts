import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lap } from '../../entities/lap.entity';
import { LapController } from './lap.controller';
import { LapService } from './lap.service';
import { RunnerModule } from '../runner/runner.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lap]),
    RunnerModule,
  ],
  controllers: [LapController],
  providers: [LapService],
  exports: [LapService],
})
export class LapModule {}

