import { Injectable, Logger } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { EVENTS_EXCHANGE } from './events.constants';
import { NotificationsService } from '../notifications/notifications.service';

interface EventPayload<T = unknown> {
  type: string;
  occurredAt: string;
  data: T;
}

@Injectable()
export class EventsConsumer {
  private readonly logger = new Logger(EventsConsumer.name);

  constructor(private readonly notificationsService: NotificationsService) {}

  @RabbitSubscribe({
    exchange: EVENTS_EXCHANGE,
    routingKey: 'user.*',
    queue: 'monitor.user-events',
  })
  async handleUserEvents(payload: EventPayload) {
    this.logger.log(`Received event ${payload.type} at ${payload.occurredAt}`);
    this.logger.log(`Data: ${JSON.stringify(payload.data)}`);

    const notification = this.buildNotification(payload);
    if (!notification) return;

    await this.notificationsService.notifyAdmins(notification);
  }

  private buildNotification(payload: EventPayload<any>) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { type, data } = payload;

    /**
     * Create the notification
     * based on type
     */
    switch (type) {
      case 'user.profile_updated':
        return {
          title: 'Profile Updated',
          body: `${data.userName} updated: ${(data.changedFields ?? []).join(', ')}`,
          data: {
            eventType: type,
            userId: String(data.userId),
          },
        };

      default:
        return null;
    }
  }
}
