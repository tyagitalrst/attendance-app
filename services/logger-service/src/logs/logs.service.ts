import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { QueryLogDto } from './dto/query-log.dto';

@Injectable()
export class LogsService {
  constructor(private readonly prisma: PrismaService) {}

  async getLogs(query: QueryLogDto) {
    const limit = query.limit ?? 50;

    const logs = await this.prisma.eventLog.findMany({
      where: {
        ...(query.eventType && { eventType: query.eventType }),
        ...(query.startDate || query.endDate
          ? {
              occurredAt: {
                ...(query.startDate && { gte: new Date(query.startDate) }),
                ...(query.endDate && { lte: new Date(query.endDate) }),
              },
            }
          : {}),
      },
      orderBy: { occurredAt: 'desc' },
      take: limit,
    });

    return logs.map((log) => ({ ...log, id: log.id.toString() }));
  }
}
