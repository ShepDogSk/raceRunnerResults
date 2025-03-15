import api from './api';

export interface NfcTag {
  id: number;
  tagId: string;
  runner?: {
    id: number;
    firstName: string;
    lastName: string;
  } | null;
  firstSeen: Date;
  lastSeen: Date;
  lastAssigned: Date | null;
  isActive: boolean;
}

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

export interface NfcLog {
  id: number;
  timestamp: Date;
  eventType: NfcEventType;
  tagId: string;
  tag?: NfcTag | null;
  runner?: {
    id: number;
    firstName: string;
    lastName: string;
    runnerNumber: number;
  } | null;
  details?: string;
  lapNumber?: number;
  isThrottled: boolean;
  errorMessage?: string;
}

export interface NfcTagAssignmentRequest {
  tagId: string;
  runnerId: number;
}

export interface NfcTagResponse {
  status: string;
  message: string;
  tagId: string;
  runnerId?: number;
  runnerName?: string;
  lapNumber?: number;
  lapTime?: Date;
  retryAfter?: number;
}

class NfcService {
  private readonly baseUrl = '/nfc';

  /**
   * Get all unassigned NFC tags
   */
  async getUnassignedTags(): Promise<NfcTag[]> {
    const response = await api.get(`${this.baseUrl}/unassigned-tags`);
    return response.data;
  }

  /**
   * Assign an NFC tag to a runner
   */
  async assignTagToRunner(tagId: string, runnerId: number): Promise<any> {
    const response = await api.post(`${this.baseUrl}/assign-tag`, {
      tagId,
      runnerId
    });
    return response.data;
  }

  /**
   * Unassign an NFC tag from a runner
   */
  async unassignTagFromRunner(runnerId: number): Promise<any> {
    const response = await api.post(`${this.baseUrl}/unassign-tag`, {
      runnerId
    });
    return response.data;
  }

  /**
   * Process a tag scan (this would be called from the Arduino device)
   * This is included here for testing purposes
   */
  async processTag(tagId: string): Promise<NfcTagResponse> {
    const response = await api.post(`${this.baseUrl}/process-tag`, {
      tagId
    });
    return response.data;
  }

  /**
   * Check if a tag ID is in a valid format
   */
  isValidTagId(tagId: string): boolean {
    // NFC tag IDs are typically hexadecimal strings
    // Adjust this validation as needed for your specific format
    return /^[A-Fa-f0-9]{4,32}$/.test(tagId);
  }

  /**
   * Format a tag ID for display (e.g., add colons between bytes)
   */
  formatTagId(tagId: string): string {
    // If the tag ID is not valid, return it as is
    if (!this.isValidTagId(tagId)) {
      return tagId;
    }

    // Add colons every 2 characters for readability
    const parts: string[] = [];
    for (let i = 0; i < tagId.length; i += 2) {
      parts.push(tagId.substring(i, i + 2));
    }
    return parts.join(':').toUpperCase();
  }

  /**
   * Get NFC log history with optional limit
   */
  async getNfcLogs(limit: number = 100): Promise<NfcLog[]> {
    const response = await api.get(`${this.baseUrl}/logs`, {
      params: { limit }
    });
    return response.data;
  }

  /**
   * Get the display text for an NFC event type
   */
  getEventTypeDisplay(eventType: NfcEventType): string {
    const displayMap = {
      [NfcEventType.SCAN]: 'Tag Scan',
      [NfcEventType.TAG_REGISTERED]: 'Tag Registered',
      [NfcEventType.TAG_ASSIGNED]: 'Tag Assigned',
      [NfcEventType.TAG_UNASSIGNED]: 'Tag Unassigned',
      [NfcEventType.RUNNER_STARTED]: 'Runner Started',
      [NfcEventType.LAP_LOGGED]: 'Lap Logged',
      [NfcEventType.SCAN_THROTTLED]: 'Scan Throttled',
      [NfcEventType.ERROR]: 'Error'
    };
    return displayMap[eventType] || eventType;
  }
}

export default new NfcService();

