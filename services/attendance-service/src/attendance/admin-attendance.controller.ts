import { Controller, Get, Query } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { QueryAttendanceDto } from './dto/query-attendance.dto';
import { AdminOnly } from '../user-identity/decorators/admin-only.decorator';

@Controller('admin/attendance')
@AdminOnly()
export class AdminAttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get('histories')
  getAttendanceHistory(@Query() query: QueryAttendanceDto) {
    return this.attendanceService.getAttendanceHistory(query);
  }
}
