import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lap } from '../../entities/lap.entity';
import { RunnerService } from '../runner/runner.service';

@Injectable()
export class LapService {
  constructor(
    @InjectRepository(Lap)
    private lapRepository: Repository<Lap>,
    private runnerService: RunnerService,
  ) {}

  async findAll(): Promise<Lap[]> {
    return this.lapRepository.find({ relations: ['runner'] });
  }

  async findOne(id: number): Promise<Lap> {
    const lap = await this.lapRepository.findOne({ 
      where: { id },
      relations: ['runner']
    });
    if (!lap) {
      throw new NotFoundException(`Lap with ID ${id} not found`);
    }
    return lap;
  }

  async findByRunner(runnerId: number): Promise<Lap[]> {
    const runner = await this.runnerService.findOne(runnerId);
    return this.lapRepository.find({ 
      where: { runner: { id: runner.id } },
      relations: ['runner'],
      order: { lapNumber: 'ASC' }
    });
  }

  async create(lapData: Partial<Lap>): Promise<Lap> {
    const lap = this.lapRepository.create(lapData);
    return this.lapRepository.save(lap);
  }

  async createForRunner(runnerId: number): Promise<Lap> {
    // Delegate to the runner service's logLap method which handles all the logic
    // including updating the runner's stats
    await this.runnerService.logLap(runnerId);
    
    // Get the latest lap that was just created
    const laps = await this.findByRunner(runnerId);
    return laps[laps.length - 1];
  }
}

