import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Runner } from '../../entities/runner.entity';
import { Lap } from '../../entities/lap.entity';
import { RunnerController } from './runner.controller';
import { RunnerService } from './runner.service';
import { CategoryModule } from '../category/category.module';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Runner, Lap]),
    CategoryModule,
    EventsModule,
  ],
  controllers: [RunnerController],
  providers: [RunnerService],
  exports: [RunnerService],
})
export class RunnerModule {}

