import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Runner, RunnerStatus } from '../../entities/runner.entity';
import { Lap } from '../../entities/lap.entity';
import { CategoryService } from '../category/category.service';
import { EventsGateway } from '../events/events.gateway';

@Injectable()
export class RunnerService {
  constructor(
    @InjectRepository(Runner)
    private runnerRepository: Repository<Runner>,
    @InjectRepository(Lap)
    private lapRepository: Repository<Lap>,
    private categoryService: CategoryService,
    private eventsGateway: EventsGateway,
  ) {}

  async findAll(): Promise<Runner[]> {
    return this.runnerRepository.find({ relations: ['category'] });
  }

  async findOne(id: number): Promise<Runner> {
    const runner = await this.runnerRepository.findOne({ 
      where: { id },
      relations: ['category', 'laps']
    });
    if (!runner) {
      throw new NotFoundException(`Runner with ID ${id} not found`);
    }
    return runner;
  }

  async findByCategory(categoryId: number): Promise<Runner[]> {
    const category = await this.categoryService.findOne(categoryId);
    return this.runnerRepository.find({ 
      where: { category: { id: category.id } },
      relations: ['category']
    });
  }

  async create(runner: Runner): Promise<Runner> {
    if (runner.category && runner.category.id) {
      const category = await this.categoryService.findOne(runner.category.id);
      runner.category = category;
    }
    const savedRunner = await this.runnerRepository.save(runner);
    
    // Emit runner created event via WebSockets
    this.eventsGateway.emitRunnerUpdated(savedRunner);
    
    // Emit race results updated event for the category
    if (savedRunner.category?.id) {
      this.eventsGateway.emitRaceResultsUpdated(savedRunner.category.id);
    }
    
    return savedRunner;
  }

  async update(id: number, updatedRunner: Runner): Promise<Runner> {
    const runner = await this.findOne(id);
    
    if (updatedRunner.category && updatedRunner.category.id) {
      const category = await this.categoryService.findOne(updatedRunner.category.id);
      updatedRunner.category = category;
    }
    
    const merged = this.runnerRepository.merge(runner, updatedRunner);
    const savedRunner = await this.runnerRepository.save(merged);
    
    // Emit runner updated event via WebSockets
    this.eventsGateway.emitRunnerUpdated(savedRunner);
    
    // If category changed, emit race results updated for both categories
    if (runner.category?.id !== savedRunner.category?.id) {
      if (runner.category?.id) {
        this.eventsGateway.emitRaceResultsUpdated(runner.category.id);
      }
      if (savedRunner.category?.id) {
        this.eventsGateway.emitRaceResultsUpdated(savedRunner.category.id);
      }
    }
    
    return savedRunner;
  }

  async remove(id: number): Promise<void> {
    const result = await this.runnerRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Runner with ID ${id} not found`);
    }
  }

  async startRunner(id: number): Promise<Runner> {
    const runner = await this.findOne(id);
    
    if (runner.isFinished) {
      throw new BadRequestException('Cannot start a finished run');
    }
    
    if (!runner.isStarted) {
      runner.isStarted = true;
      runner.startTime = new Date();
      runner.status = RunnerStatus.RUNNING;
      const savedRunner = await this.runnerRepository.save(runner);
      
      // Emit runner started event
      this.eventsGateway.emitRunnerStarted(savedRunner);
      
      // Emit race results updated for category
      if (savedRunner.category?.id) {
        this.eventsGateway.emitRaceResultsUpdated(savedRunner.category.id);
      }
      
      return savedRunner;
    } else if (runner.isPaused) {
      // If runner was paused, resume it
      return this.resumeRunner(id);
    }
    
    return runner;
  }

  async pauseRunner(id: number): Promise<Runner> {
    const runner = await this.findOne(id);
    
    if (!runner.isStarted) {
      throw new BadRequestException('Runner has not been started yet');
    }
    
    if (runner.isFinished) {
      throw new BadRequestException('Cannot pause a finished run');
    }
    
    if (runner.isPaused) {
      return runner; // Already paused
    }
    
    // Set pause time
    runner.isPaused = true;
    runner.pauseTime = new Date();
    runner.status = RunnerStatus.PAUSED;
    
    const savedRunner = await this.runnerRepository.save(runner);
    
    // Emit runner paused event
    this.eventsGateway.emitRunnerPaused(savedRunner);
    
    // Emit race results updated for category
    if (savedRunner.category?.id) {
      this.eventsGateway.emitRaceResultsUpdated(savedRunner.category.id);
    }
    
    return savedRunner;
  }

  async resumeRunner(id: number): Promise<Runner> {
    const runner = await this.findOne(id);
    
    if (!runner.isStarted) {
      throw new BadRequestException('Runner has not been started yet');
    }
    
    if (runner.isFinished) {
      throw new BadRequestException('Cannot resume a finished run');
    }
    
    if (!runner.isPaused) {
      return runner; // Already running
    }
    
    // Calculate paused time
    const now = new Date();
    if (runner.pauseTime) {
      const pauseDuration = now.getTime() - runner.pauseTime.getTime();
      
      // Update total paused time
      runner.totalPausedTime = (runner.totalPausedTime || 0) + pauseDuration;
    }
    
    // Reset pause state
    runner.isPaused = false;
    runner.pauseTime = null;
    runner.status = RunnerStatus.RUNNING;
    
    const savedRunner = await this.runnerRepository.save(runner);
    
    // Emit runner resumed event
    this.eventsGateway.emitRunnerResumed(savedRunner);
    
    // Emit race results updated for category
    if (savedRunner.category?.id) {
      this.eventsGateway.emitRaceResultsUpdated(savedRunner.category.id);
    }
    
    return savedRunner;
  }

  async finishRunner(id: number): Promise<Runner> {
    let runner = await this.findOne(id);
    
    if (!runner.isStarted) {
      throw new BadRequestException('Runner has not been started yet');
    }
    
    if (runner.isFinished) {
      return runner; // Already finished
    }
    
    // If paused, resume first to calculate correct paused time
    if (runner.isPaused) {
      await this.resumeRunner(id);
      runner = await this.findOne(id); // Refresh runner data
    }
    
    // Set finish time and calculate total running time
    runner.isFinished = true;
    runner.finishTime = new Date();
    runner.totalRunningTime = runner.calculateRunningTime();
    runner.status = RunnerStatus.FINISHED;
    
    const savedRunner = await this.runnerRepository.save(runner);
    
    // Emit runner finished event
    this.eventsGateway.emitRunnerFinished(savedRunner);
    
    // Emit race results updated for category
    if (savedRunner.category?.id) {
      this.eventsGateway.emitRaceResultsUpdated(savedRunner.category.id);
    }
    
    return savedRunner;
  }

  async logLap(id: number): Promise<Runner> {
    const runner = await this.findOne(id);
    
    if (!runner.isStarted) {
      throw new BadRequestException('Runner has not been started yet');
    }
    
    if (runner.isFinished) {
      throw new BadRequestException('Cannot log lap for a finished run');
    }
    
    if (runner.isPaused) {
      throw new BadRequestException('Cannot log lap while runner is paused');
    }
    
    const category = await this.categoryService.findOne(runner.category.id);
    
    // Create a new lap
    const lap = new Lap();
    lap.runner = runner;
    lap.lapNumber = runner.totalLaps + 1;
    lap.distance = category.distance;
    lap.timestamp = new Date();
    
    const savedLap = await this.lapRepository.save(lap);
    
    // Update runner stats
    runner.totalLaps += 1;
    runner.totalDistance += category.distance;
    
    const savedRunner = await this.runnerRepository.save(runner);
    
    // Emit lap created event
    this.eventsGateway.emitLapCreated(savedLap);
    
    // Emit runner updated event
    this.eventsGateway.emitRunnerUpdated(savedRunner);
    
    // Emit race results updated for category
    if (savedRunner.category?.id) {
      this.eventsGateway.emitRaceResultsUpdated(savedRunner.category.id);
    }
    
    return savedRunner;
  }
}

