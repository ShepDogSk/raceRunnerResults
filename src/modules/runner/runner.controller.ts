import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Patch } from '@nestjs/common';
import { RunnerService } from './runner.service';
import { Runner } from '../../entities/runner.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('runners')
export class RunnerController {
  constructor(private readonly runnerService: RunnerService) {}

  @Get()
  findAll(): Promise<Runner[]> {
    return this.runnerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Runner> {
    return this.runnerService.findOne(id);
  }

  @Get('category/:categoryId')
  findByCategory(@Param('categoryId') categoryId: number): Promise<Runner[]> {
    return this.runnerService.findByCategory(categoryId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() runner: Runner): Promise<Runner> {
    return this.runnerService.create(runner);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: number, @Body() runner: Runner): Promise<Runner> {
    return this.runnerService.update(id, runner);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.runnerService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/start')
  startRunner(@Param('id') id: number): Promise<Runner> {
    return this.runnerService.startRunner(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/pause')
  pauseRunner(@Param('id') id: number): Promise<Runner> {
    return this.runnerService.pauseRunner(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/resume')
  resumeRunner(@Param('id') id: number): Promise<Runner> {
    return this.runnerService.resumeRunner(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/finish')
  finishRunner(@Param('id') id: number): Promise<Runner> {
    return this.runnerService.finishRunner(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/lap')
  logLap(@Param('id') id: number): Promise<Runner> {
    return this.runnerService.logLap(id);
  }
}
