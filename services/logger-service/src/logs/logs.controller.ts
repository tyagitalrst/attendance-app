import { Controller, Get, Query } from '@nestjs/common';
import { LogsService } from './logs.service';
import { QueryLogDto } from './dto/query-log.dto';
import { AdminOnly } from '../user-identity/decorators/admin-only.decorator';

@Controller('logs')
@AdminOnly()
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Get()
  getLogs(@Query() query: QueryLogDto) {
    return this.logsService.getLogs(query);
  }
}
