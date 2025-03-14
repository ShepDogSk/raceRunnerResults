// Using type import to avoid circular dependency issues
import type { Category } from './category';
import type { Lap } from './lap';

export enum RunnerStatus {
  NOT_STARTED = 'not_started',
  RUNNING = 'running',
  PAUSED = 'paused',
  FINISHED = 'finished'
}

export interface Runner {
  id?: number;
  runnerNumber: number;
  firstName: string;
  lastName: string;
  nickname?: string;
  email?: string;
  phoneNumber?: string;
  category: Category;
  internalNote?: string;
  nfcChipId?: string;
  
  // Race status
  status: RunnerStatus;
  isStarted: boolean;
  isPaused?: boolean;
  isFinished?: boolean;
  startTime?: Date;
  finishTime?: Date;
  pauseTime?: Date;
  totalPausedTime?: number;
  totalRunningTime?: number;

  // Lap data
  totalLaps: number;
  totalDistance: number;
  laps?: Lap[];
  
  // Tag information
  tagId?: string;
}
