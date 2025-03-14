import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoryModule } from './modules/category/category.module';
import { RunnerModule } from './modules/runner/runner.module';
import { LapModule } from './modules/lap/lap.module';
import { AuthModule } from './modules/auth/auth.module';
import { NfcModule } from './modules/nfc/nfc.module';
import { EventsModule } from './modules/events/events.module';
import { databaseConfig } from './config/database.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client', 'dist'),
      exclude: ['/api*'],
    }),
    CategoryModule,
    RunnerModule,
    LapModule,
    AuthModule,
    NfcModule,
    EventsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
