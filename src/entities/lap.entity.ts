import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Runner } from './runner.entity';

@Entity()
export class Lap {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Runner, runner => runner.laps)
  runner: Runner;

  @CreateDateColumn()
  timestamp: Date;

  @Column('float')
  distance: number;

  @Column()
  lapNumber: number;
}

