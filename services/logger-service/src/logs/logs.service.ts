import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { QueryLogDto } from './dto/query-log.dto';

@Injectable()
export class LogsService {
  constructor(private readonly prisma: PrismaService) {}

  async getLogs(query: QueryLogDto) {
    const where = {
      ...(query.eventType && { eventType: query.eventType }),
      ...(query.startDate || query.endDate
        ? {
            occurredAt: {
              ...(query.startDate && { gte: new Date(query.startDate) }),
              ...(query.endDate && { lte: new Date(query.endDate) }),
            },
          }
        : {}),
    };

    const pageNo = query.pageNo ?? 1;
    const pageSize = query.pageSize ?? 10;
    const skip = (pageNo - 1) * pageSize;

    const [logs, total] = await Promise.all([
      this.prisma.eventLog.findMany({
        where,
        orderBy: { occurredAt: 'desc' },
        skip,
        take: pageSize,
      }),
      this.prisma.eventLog.count({ where }),
    ]);

    return {
      data: logs.map((log) => ({ ...log, id: log.id.toString() })),
      totalRecords: total,
      pageNo,
      pageSize,
    };
  }
}
