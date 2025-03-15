import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Runner } from './runner.entity';

@Entity('nfc_tag')
export class NfcTag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  tagId: string;

  @ManyToOne(() => Runner, { nullable: true })
  @JoinColumn()
  runner: Runner | null;

  @Column()
  firstSeen: Date;

  @Column()
  lastSeen: Date;

  @Column({ nullable: true })
  lastAssigned: Date;

  @Column({ default: true })
  isActive: boolean;
}

