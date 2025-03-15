import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NfcController } from './nfc.controller';
import { NfcService } from './nfc.service';
import { NfcTag } from 'src/entities/nfc-tag.entity';
import { NfcLog } from 'src/entities/nfc-log.entity';
import { RunnerModule } from '../runner/runner.module';
import { LapModule } from '../lap/lap.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([NfcTag, NfcLog]),
    RunnerModule,
    LapModule
  ],
  controllers: [NfcController],
  providers: [NfcService],
  exports: [NfcService]
})
export class NfcModule {}

