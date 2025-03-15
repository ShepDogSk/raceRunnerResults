import api from './api';
import { Category } from './category.service';

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
  nfcTagId?: string;
  status: RunnerStatus;
  isStarted: boolean;
  startTime?: Date;
  isPaused?: boolean;
  pauseTime?: Date;
  totalPausedTime?: number;
  isFinished?: boolean;
  finishTime?: Date;
  totalRunningTime?: number;
  totalLaps: number;
  totalDistance: number;
  laps?: Lap[];
}

export interface Lap {
  id?: number;
  runner?: Runner;
  timestamp: Date;
  distance: number;
  lapNumber: number;
}

export const RunnerService = {
  getAll: async (): Promise<Runner[]> => {
    const response = await api.get<Runner[]>('/runners');
    return response.data;
  },

  getById: async (id: number): Promise<Runner> => {
    const response = await api.get<Runner>(`/runners/${id}`);
    return response.data;
  },

  getByCategory: async (categoryId: number): Promise<Runner[]> => {
    const response = await api.get<Runner[]>(`/runners/category/${categoryId}`);
    return response.data;
  },

  create: async (runner: Runner): Promise<Runner> => {
    const response = await api.post<Runner>('/runners', runner);
    return response.data;
  },

  update: async (id: number, runner: Runner): Promise<Runner> => {
    const response = await api.put<Runner>(`/runners/${id}`, runner);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/runners/${id}`);
  },

  startRunner: async (id: number): Promise<Runner> => {
    const response = await api.patch<Runner>(`/runners/${id}/start`);
    return response.data;
  },

  pauseRunner: async (id: number): Promise<Runner> => {
    const response = await api.patch<Runner>(`/runners/${id}/pause`);
    return response.data;
  },

  resumeRunner: async (id: number): Promise<Runner> => {
    const response = await api.patch<Runner>(`/runners/${id}/resume`);
    return response.data;
  },

  finishRunner: async (id: number): Promise<Runner> => {
    const response = await api.patch<Runner>(`/runners/${id}/finish`);
    return response.data;
  },

  logLap: async (id: number): Promise<Runner> => {
    const response = await api.post<Runner>(`/runners/${id}/lap`);
    return response.data;
  },

  // Helper method to format running time
  formatRunningTime: (milliseconds?: number): string => {
    if (!milliseconds) return '00:00:00';
    
    const seconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      remainingSeconds.toString().padStart(2, '0')
    ].join(':');
  }
};

export default RunnerService;

