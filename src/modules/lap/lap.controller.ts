import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { LapService } from './lap.service';
import { Lap } from '../../entities/lap.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('laps')
export class LapController {
  constructor(private readonly lapService: LapService) {}

  @Get()
  findAll(): Promise<Lap[]> {
    return this.lapService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Lap> {
    return this.lapService.findOne(id);
  }

  @Get('runner/:runnerId')
  findByRunner(@Param('runnerId') runnerId: number): Promise<Lap[]> {
    return this.lapService.findByRunner(runnerId);
  }
}

