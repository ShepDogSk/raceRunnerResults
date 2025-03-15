import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Runner } from './runner.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('float')
  distance: number;

  @Column()
  year: number;

  @OneToMany(() => Runner, runner => runner.category)
  runners: Runner[];
}

