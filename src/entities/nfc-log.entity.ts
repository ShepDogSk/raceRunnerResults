import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Runner } from './runner.entity';
import { NfcTag } from './nfc-tag.entity';

export enum NfcEventType {
  SCAN = 'scan',
  TAG_REGISTERED = 'tag_registered',
  TAG_ASSIGNED = 'tag_assigned',
  TAG_UNASSIGNED = 'tag_unassigned',
  RUNNER_STARTED = 'runner_started',
  LAP_LOGGED = 'lap_logged',
  SCAN_THROTTLED = 'scan_throttled',
  ERROR = 'error'
}

@Entity('nfc_log')
export class NfcLog {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  timestamp: Date;

  @Column({ type: 'enum', enum: NfcEventType })
  eventType: NfcEventType;

  @Column({ nullable: true })
  tagId: string;

  @ManyToOne(() => NfcTag, { nullable: true })
  @JoinColumn()
  tag: NfcTag | null;

  @ManyToOne(() => Runner, { nullable: true })
  @JoinColumn()
  runner: Runner | null;

  @Column({ nullable: true })
  details: string;

  @Column({ nullable: true })
  lapNumber: number;

  @Column({ type: 'boolean', default: false })
  isThrottled: boolean;

  @Column({ nullable: true })
  errorMessage: string;
}
