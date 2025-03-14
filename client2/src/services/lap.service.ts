import api from './api';
import { Lap } from './runner.service';

export const LapService = {
  getAll: async (): Promise<Lap[]> => {
    const response = await api.get<Lap[]>('/laps');
    return response.data;
  },

  getById: async (id: number): Promise<Lap> => {
    const response = await api.get<Lap>(`/laps/${id}`);
    return response.data;
  },

  getByRunner: async (runnerId: number): Promise<Lap[]> => {
    const response = await api.get<Lap[]>(`/laps/runner/${runnerId}`);
    return response.data;
  }
};

export default LapService;
