import { Injectable, Logger } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { EVENTS_EXCHANGE } from './events.constants';

interface EventPayload<T = unknown> {
  type: string;
  occurredAt: string;
  data: T;
}

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(private readonly amqp: AmqpConnection) {}

  async publish<T>(routingKey: string, data: T) {
    const payload: EventPayload<T> = {
      type: routingKey,
      occurredAt: new Date().toISOString(),
      data,
    };

    try {
      await this.amqp.publish(EVENTS_EXCHANGE, routingKey, payload);
      this.logger.log(`Published event: ${routingKey}`);
    } catch (err) {
      this.logger.error(`Failed to publish event ${routingKey}`, err);
    }
  }
}
