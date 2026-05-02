import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

interface EventPayload<T = unknown> {
  type: string;
  occurredAt: string;
  data: T;
}

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async save(payload: EventPayload) {
    try {
      await this.prisma.eventLog.create({
        data: {
          eventType: payload.type,
          occurredAt: new Date(payload.occurredAt),
          payload: payload.data as object,
        },
      });
      this.logger.log(`Saved log: ${payload.type}`);
    } catch (error) {
      this.logger.error(`Failed to save log for ${payload.type}`, error);
    }
  }
}
