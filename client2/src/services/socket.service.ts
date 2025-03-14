import { io, Socket } from 'socket.io-client';
import { Runner } from '../types/runner';
import { Lap } from '../types/lap';

/**
 * Socket service for real-time updates
 * This service connects to the WebSocket server and handles the events emitted by the server
 */
class SocketService {
  private socket: Socket | null = null;
  private listeners: Record<string, Function[]> = {};
  private connected = false;

  /**
   * Initialize socket connection
   */
  init() {
    if (this.socket) {
      return; // Already initialized
    }

    // Connect to the WebSocket server
    // Use the same host/port as the API, but with WebSocket protocol
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const host = window.location.host;
    const url = `${protocol}://${host}`;

    this.socket = io(url);

    // Setup connection events
    this.socket.on('connect', () => {
      console.log('Socket connected!');
      this.connected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected!');
      this.connected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.connected = false;
    });

    // Setup event listeners for race-related events
    this.setupRaceEventListeners();
  }

  /**
   * Setup event listeners for race-related events
   */
  private setupRaceEventListeners() {
    if (!this.socket) return;

    // Runner events
    this.socket.on('runner.updated', (runner: Runner) => {
      this.emitEvent('runner.updated', runner);
    });

    this.socket.on('runner.started', (runner: Runner) => {
      this.emitEvent('runner.started', runner);
    });

    this.socket.on('runner.paused', (runner: Runner) => {
      this.emitEvent('runner.paused', runner);
    });

    this.socket.on('runner.resumed', (runner: Runner) => {
      this.emitEvent('runner.resumed', runner);
    });

    this.socket.on('runner.finished', (runner: Runner) => {
      this.emitEvent('runner.finished', runner);
    });

    // Lap events
    this.socket.on('lap.created', (lap: Lap) => {
      this.emitEvent('lap.created', lap);
    });

    // Results events
    this.socket.on('results.updated', (data: any) => {
      this.emitEvent('results.updated', data);
    });

    this.socket.on('results.updated.category', (data: { categoryId: number }) => {
      this.emitEvent('results.updated.category', data);
    });
  }

  /**
   * Subscribe to an event
   * @param eventName Name of the event to subscribe to
   * @param callback Callback to execute when the event is triggered
   * @returns Function to unsubscribe
   */
  subscribe(eventName: string, callback: Function): () => void {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }

    this.listeners[eventName].push(callback);

    // Return unsubscribe function
    return () => {
      if (!this.listeners[eventName]) return;
      
      this.listeners[eventName] = this.listeners[eventName].filter(
        (cb) => cb !== callback
      );
    };
  }

  /**
   * Emit event to all subscribers
   * @param eventName Name of the event
   * @param data Data to send with the event
   */
  private emitEvent(eventName: string, data: any) {
    if (!this.listeners[eventName]) return;

    this.listeners[eventName].forEach((callback) => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in socket event handler for "${eventName}":`, error);
      }
    });
  }

  /**
   * Check if socket is connected
   */
  isConnected(): boolean {
    return this.connected;
  }

  /**
   * Disconnect socket
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }
}

// Export singleton instance
export default new SocketService();
