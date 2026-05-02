import { Injectable, Logger } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { EVENTS_EXCHANGE } from './events.constants';
import { EventsService } from './events.service';

interface EventPayload<T = unknown> {
  type: string;
  occurredAt: string;
  data: T;
}

@Injectable()
export class EventsConsumer {
  private readonly logger = new Logger(EventsConsumer.name);

  constructor(private readonly eventsService: EventsService) {}

  @RabbitSubscribe({
    exchange: EVENTS_EXCHANGE,
    routingKey: '#',
    queue: 'logger.all-events',
  })
  async handleAllEvents(payload: EventPayload) {
    this.logger.log(`Received: ${payload.type}`);
    await this.eventsService.save(payload);
  }
}
