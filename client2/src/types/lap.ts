import { Runner } from './runner';

export interface Lap {
  id?: number;
  runner?: Runner;
  lapNumber: number;
  distance: number;
  timestamp: Date;
  duration?: number;
}
