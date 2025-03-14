

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { NfcTag } from 'src/entities/nfc-tag.entity';
import { NfcLog, NfcEventType } from 'src/entities/nfc-log.entity';
import { RunnerService } from '../runner/runner.service';
import { LapService } from '../lap/lap.service';

@Injectable()
export class NfcService {
  private lastTagProcessingTime: Map<string, number> = new Map();
  private readonly minTimeBetweenLaps = 60000; // 1 minute in milliseconds

  constructor(
    @InjectRepository(NfcTag)
    private nfcTagsRepository: Repository<NfcTag>,
    @InjectRepository(NfcLog)
    private nfcLogRepository: Repository<NfcLog>,
    private runnerService: RunnerService,
    private lapService: LapService,
  ) {}

  /**
   * Log an NFC event
   */
  private async logNfcEvent(
    eventType: NfcEventType, 
    tagId: string, 
    runner?: any, 
    details?: string, 
    lapNumber?: number, 
    isThrottled?: boolean,
    errorMessage?: string
  ): Promise<NfcLog> {
    const log = new NfcLog();
    log.eventType = eventType;
    log.tagId = tagId;
    
    // Find tag entity if it exists
    try {
      const tag = await this.nfcTagsRepository.findOneBy({ tagId });
      if (tag) {
        log.tag = tag;
      }
    } catch (error) {
      // If tag doesn't exist in database, just record the ID string
    }
    
    // Add runner if provided
    if (runner) {
      log.runner = runner;
    }
    
    if (details) log.details = details;
    if (lapNumber) log.lapNumber = lapNumber;
    if (isThrottled !== undefined) log.isThrottled = isThrottled;
    if (errorMessage) log.errorMessage = errorMessage;
    
    return this.nfcLogRepository.save(log);
  }

  /**
   * Get all NFC logs
   */
  async getAllLogs(limit: number = 100): Promise<NfcLog[]> {
    return this.nfcLogRepository.find({
      relations: ['runner', 'tag'],
      order: { timestamp: 'DESC' },
      take: limit
    });
  }

  /**
   * Process an NFC tag scan from the hardware reader
   * If tag is unassigned, register it
   * If tag is assigned to a runner, log a lap
   */
  async processTag(tagId: string) {
    if (!tagId) {
      throw new BadRequestException('Tag ID is required');
    }

    // Check if this tag exists in the database
    let tag = await this.nfcTagsRepository.findOne({
      where: { tagId },
      relations: ['runner']
    });

    // If tag does not exist, register it as a new unassigned tag
    if (!tag) {
      tag = await this.registerNewTag(tagId);
      await this.logNfcEvent(NfcEventType.TAG_REGISTERED, tagId, null, 'New tag registered');
      return {
        status: 'new_tag_registered',
        message: 'New tag has been registered and is ready to be assigned to a runner',
        tagId
      };
    }

    // If tag exists but is not assigned to a runner
    if (!tag.runner) {
      await this.logNfcEvent(NfcEventType.SCAN, tagId, null, 'Unassigned tag scanned');
      return {
        status: 'unassigned_tag',
        message: 'This tag is not assigned to any runner',
        tagId
      };
    }

    // If tag is assigned to a runner, check throttling
    const now = Date.now();
    const lastProcessingTime = this.lastTagProcessingTime.get(tagId) || 0;
    
    if (now - lastProcessingTime < this.minTimeBetweenLaps) {
      const retryAfter = Math.ceil((lastProcessingTime + this.minTimeBetweenLaps - now) / 1000);
      await this.logNfcEvent(
        NfcEventType.SCAN_THROTTLED, 
        tagId, 
        tag.runner, 
        `Tag scanned too soon (${retryAfter}s to wait)`, 
        undefined, 
        true
      );
      return {
        status: 'throttled',
        message: 'Tag was scanned too soon after previous scan',
        tagId,
        retryAfter
      };
    }

    // Tag is assigned and not throttled, log a lap
    try {
      // Get runner details
      const runner = await this.runnerService.findOne(tag.runner.id);
      
      if (!runner.isStarted) {
        // Start the runner if not started
        await this.runnerService.startRunner(runner.id);
        this.lastTagProcessingTime.set(tagId, now);
        
        await this.logNfcEvent(
          NfcEventType.RUNNER_STARTED, 
          tagId, 
          runner, 
          `Runner started via NFC tag`
        );
        
        return {
          status: 'runner_started',
          message: 'Runner has been started',
          tagId,
          runnerId: runner.id,
          runnerName: `${runner.firstName} ${runner.lastName}`
        };
      }
      
      if (runner.isFinished) {
        await this.logNfcEvent(
          NfcEventType.ERROR, 
          tagId, 
          runner, 
          undefined, 
          undefined, 
          false, 
          'Runner has already finished the race'
        );
        return {
          status: 'error',
          message: 'Runner has already finished the race',
          tagId
        };
      }
      
      if (runner.isPaused) {
        // Resume runner if paused
        await this.runnerService.resumeRunner(runner.id);
      }
      
      // Log a lap
      const lap = await this.lapService.createForRunner(runner.id);
      const updatedRunner = await this.runnerService.findOne(runner.id);
      
      this.lastTagProcessingTime.set(tagId, now);
      
      await this.logNfcEvent(
        NfcEventType.LAP_LOGGED, 
        tagId, 
        runner, 
        `Lap ${updatedRunner.totalLaps} logged`, 
        updatedRunner.totalLaps
      );
      
      return {
        status: 'lap_logged',
        message: 'Lap has been logged successfully',
        tagId,
        runnerId: runner.id,
        runnerName: `${runner.firstName} ${runner.lastName}`,
        lapNumber: updatedRunner.totalLaps,
        lapTime: new Date()
      };
    } catch (error) {
      await this.logNfcEvent(
        NfcEventType.ERROR, 
        tagId, 
        tag.runner, 
        undefined, 
        undefined, 
        false, 
        error.message
      );
      return {
        status: 'error',
        message: `Failed to log lap: ${error.message}`,
        tagId
      };
    }
  }

  /**
   * Assign an NFC tag to a runner
   */
  async assignTagToRunner(tagId: string, runnerId: number) {
    // Check if the tag exists
    let tag = await this.nfcTagsRepository.findOne({
      where: { tagId },
      relations: ['runner']
    });

    // If tag doesn't exist, create it
    if (!tag) {
      tag = await this.registerNewTag(tagId);
    }

    // Check if the tag is already assigned to another runner
    if (tag.runner && tag.runner.id !== runnerId) {
      throw new BadRequestException(
        `Tag is already assigned to runner ${tag.runner.id}: ${tag.runner.firstName} ${tag.runner.lastName}`
      );
    }

    // Find the runner
    const runner = await this.runnerService.findOne(runnerId);
    if (!runner) {
      throw new NotFoundException(`Runner with ID ${runnerId} not found`);
    }

    // Check if the runner already has a different tag assigned
    const existingTag = await this.nfcTagsRepository.findOne({
      where: { runner: { id: runnerId } }
    });

    if (existingTag && existingTag.tagId !== tagId) {
      // Update the existing tag to unassign it
      existingTag.runner = null;
      await this.nfcTagsRepository.save(existingTag);
    }

    // Assign the tag to the runner
    tag.runner = runner;
    tag.lastAssigned = new Date();
    const savedTag = await this.nfcTagsRepository.save(tag);

    // Update the runner's nfcTagId field
    runner.nfcTagId = tagId;
    await this.runnerService.update(runner.id, runner);

    return {
      tagId: savedTag.tagId,
      runnerId: runner.id,
      runnerName: `${runner.firstName} ${runner.lastName}`,
      message: 'Tag successfully assigned to runner'
    };
  }

  /**
   * Unassign an NFC tag from a runner
   */
  async unassignTagFromRunner(runnerId: number) {
    // Find the tag assigned to this runner
    const tag = await this.nfcTagsRepository.findOne({
      where: { runner: { id: runnerId } },
      relations: ['runner']
    });

    if (!tag) {
      throw new NotFoundException(`No tag found for runner with ID ${runnerId}`);
    }

    // Unassign the tag
    const tagId = tag.tagId;
    const runner = tag.runner;
    tag.runner = null;
    await this.nfcTagsRepository.save(tag);

    // Update the runner's nfcTagId field to empty string
    if (runner) {
      runner.nfcTagId = '';
      await this.runnerService.update(runner.id, runner);
    }

    return {
      tagId,
      runnerId,
      message: 'Tag successfully unassigned from runner'
    };
  }

  /**
   * Get all unassigned NFC tags
   */
  async getUnassignedTags() {
    const tags = await this.nfcTagsRepository.find({
      where: { runner: { id: IsNull() } },
      order: { lastSeen: 'DESC' }
    });

    return tags;
  }

  /**
   * Register a new NFC tag (unassigned)
   */
  private async registerNewTag(tagId: string): Promise<NfcTag> {
    const tag = new NfcTag();
    tag.tagId = tagId;
    tag.firstSeen = new Date();
    tag.lastSeen = new Date();
    
    return this.nfcTagsRepository.save(tag);
  }

  /**
   * Find a tag by its ID
   */
  async findByTagId(tagId: string): Promise<NfcTag> {
    const tag = await this.nfcTagsRepository.findOne({
      where: { tagId },
      relations: ['runner']
    });
    
    if (!tag) {
      throw new NotFoundException(`Tag with ID ${tagId} not found`);
    }
    
    return tag;
  }

  /**
   * Update the last seen timestamp for a tag
   */
  async updateTagLastSeen(tagId: string): Promise<NfcTag> {
    const tag = await this.findByTagId(tagId);
    tag.lastSeen = new Date();
    return this.nfcTagsRepository.save(tag);
  }
}
