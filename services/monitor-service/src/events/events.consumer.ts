import { Injectable, Logger } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { EVENTS_EXCHANGE } from './events.constants';

interface EventPayload<T = unknown> {
  type: string;
  occuredAt: string;
  data: T;
}

@Injectable()
export class EventsConsumer {
  private readonly logger = new Logger(EventsConsumer.name);

  @RabbitSubscribe({
    exchange: EVENTS_EXCHANGE,
    routingKey: 'user.*',
    queue: 'monitor.user-events',
  })
  async handleUserEvents(payload: EventPayload) {
    this.logger.log(`Received event ${payload.type} at ${payload.occuredAt}`);
    this.logger.log(`Data: ${JSON.stringify(payload.data)}`);

    switch (payload.type) {
      case 'user.clocked_in':
        // TO DO: notify admin
        break;
      case 'user.clocked_out':
        // TO DO: notify admin
        break;
      case 'user.created':
      case 'user.updated':
      case 'user.deleted':
        // TO DO: notify admin
        break;
    }
  }
}
