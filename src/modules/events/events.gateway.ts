import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { Runner } from 'src/entities/runner.entity';
import { Lap } from 'src/entities/lap.entity';

@WebSocketGateway({
  cors: {
    origin: '*',  // In production, restrict this to your frontend domain
  },
})
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('EventsGateway');

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  // Emit events to all connected clients

  /**
   * Emit event when a runner is updated
   */
  emitRunnerUpdated(runner: Runner) {
    this.server.emit('runner.updated', runner);
    this.logger.log(`Runner updated event emitted: ${runner.id}`);
  }

  /**
   * Emit event when a new lap is logged
   */
  emitLapCreated(lap: Lap) {
    this.server.emit('lap.created', lap);
    this.logger.log(`Lap created event emitted: runner ${lap.runner.id}, lap ${lap.lapNumber}`);
  }

  /**
   * Emit event when a runner starts the race
   */
  emitRunnerStarted(runner: Runner) {
    this.server.emit('runner.started', runner);
    this.logger.log(`Runner started event emitted: ${runner.id}`);
  }

  /**
   * Emit event when a runner finishes the race
   */
  emitRunnerFinished(runner: Runner) {
    this.server.emit('runner.finished', runner);
    this.logger.log(`Runner finished event emitted: ${runner.id}`);
  }

  /**
   * Emit event when a runner is paused
   */
  emitRunnerPaused(runner: Runner) {
    this.server.emit('runner.paused', runner);
    this.logger.log(`Runner paused event emitted: ${runner.id}`);
  }

  /**
   * Emit event when a runner is resumed
   */
  emitRunnerResumed(runner: Runner) {
    this.server.emit('runner.resumed', runner);
    this.logger.log(`Runner resumed event emitted: ${runner.id}`);
  }

  /**
   * Emit event when race results are updated
   */
  emitRaceResultsUpdated(categoryId?: number) {
    // If category ID is provided, we'll emit an event for that specific category
    // Otherwise, it's a global update
    if (categoryId) {
      this.server.emit('results.updated.category', { categoryId });
      this.logger.log(`Race results updated event emitted for category: ${categoryId}`);
    } else {
      this.server.emit('results.updated', {});
      this.logger.log('Global race results updated event emitted');
    }
  }
}

