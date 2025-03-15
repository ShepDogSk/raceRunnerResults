import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Category } from './category.entity';
import { Lap } from './lap.entity';

export enum RunnerStatus {
  NOT_STARTED = 'not_started',
  RUNNING = 'running',
  PAUSED = 'paused',
  FINISHED = 'finished'
}

@Entity()
export class Runner {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  runnerNumber: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  nickname: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @ManyToOne(() => Category, category => category.runners)
  category: Category;

  @Column({ nullable: true })
  internalNote: string;

  @Column({ nullable: true })
  nfcChipId: string;

  @Column({ nullable: true })
  nfcTagId: string;

  @Column({
    type: 'enum',
    enum: RunnerStatus,
    default: RunnerStatus.NOT_STARTED
  })
  status: RunnerStatus;

  @Column({ default: false })
  isStarted: boolean;

  @Column({ nullable: true, type: 'datetime' })
  startTime: Date | null;

  @Column({ default: false })
  isPaused: boolean;

  @Column({ nullable: true, type: 'datetime' })
  pauseTime: Date | null;

  @Column('int', { default: 0 })
  totalPausedTime: number; // in milliseconds

  @Column({ default: false })
  isFinished: boolean;

  @Column({ nullable: true, type: 'datetime' })
  finishTime: Date | null;

  @Column('int', { nullable: true })
  totalRunningTime: number; // in milliseconds

  @OneToMany(() => Lap, lap => lap.runner)
  laps: Lap[];

  @Column({ default: 0 })
  totalLaps: number;

  @Column('float', { default: 0 })
  totalDistance: number;

  // Calculate the current running time (excluding paused time)
  calculateRunningTime(): number {
    if (!this.isStarted || !this.startTime) {
      return 0;
    }

    let endTime: Date = new Date();
    if (this.isFinished && this.finishTime) {
      endTime = this.finishTime;
    } else if (this.isPaused && this.pauseTime) {
      endTime = this.pauseTime;
    }

    const totalTime = endTime.getTime() - this.startTime.getTime();
    return totalTime - (this.totalPausedTime || 0);
  }

  // Format the running time as HH:MM:SS
  formatRunningTime(): string {
    const runningTime = this.totalRunningTime || this.calculateRunningTime();
    const seconds = Math.floor(runningTime / 1000);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      remainingSeconds.toString().padStart(2, '0')
    ].join(':');
  }
}

