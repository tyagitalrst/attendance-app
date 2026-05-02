import {
  Body,
  Controller,
  Patch,
  Post,
  UseGuards,
  Query,
  Get,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { ClockInDto } from './dto/clock-in.dto';
import { CurrentUser } from '../user-identity/decorators/current-user.decorator';
import type { User } from '@prisma/client';
import { ClockOutDto } from './dto/clock-out.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { QueryAttendanceDto } from './dto/query-attendance.dto';

@Controller('attendances')
@UseGuards(JwtAuthGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('clock-in')
  clockIn(@CurrentUser() user: User, @Body() dto: ClockInDto) {
    return this.attendanceService.clockIn(user.id, dto);
  }

  @Patch('clock-out')
  clockOut(@CurrentUser() user: User, @Body() dto: ClockOutDto) {
    return this.attendanceService.clockOut(user.id, dto);
  }

  @Get()
  getAttendanceList(
    @CurrentUser() user: User,
    @Query() query: QueryAttendanceDto,
  ) {
    return this.attendanceService.getAttendanceList(user.id, query);
  }
}
