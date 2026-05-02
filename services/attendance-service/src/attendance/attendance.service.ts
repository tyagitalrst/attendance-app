import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { ClockInDto } from './dto/clock-in.dto';
import { AttendanceStatus } from '@prisma/client';
import { ClockOutDto } from './dto/clock-out.dto';
import { QueryAttendanceDto } from './dto/query-attendance.dto';
import { ConfigService } from '@nestjs/config';
import { toZonedTime } from 'date-fns-tz';
import { EventsService } from '../events/events.service';

@Injectable()
export class AttendanceService {
  private readonly LATE_CUTOFF_HOUR_TIME = 9; // 09:00 AM
  private readonly businessTimezone: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly eventsService: EventsService,
  ) {
    this.businessTimezone =
      this.configService.get<string>('BUSINESS_TIMEZONE') ?? 'UTC';
  }

  async clockIn(userId: number, dto: ClockInDto) {
    const now = new Date();
    const todayInBusinessTz = this.getBusinessDate(now);
    const hourInBusinessTz = this.getBusinessHour(now);

    const attendance = await this.prisma.attendance.findUnique({
      where: {
        userId_date: {
          userId,
          date: todayInBusinessTz,
        },
      },
    });

    if (attendance) {
      throw new BadRequestException('You have already clocked in today');
    }

    const status =
      hourInBusinessTz < this.LATE_CUTOFF_HOUR_TIME
        ? AttendanceStatus.PRESENT
        : AttendanceStatus.LATE;

    const newAttendance = await this.prisma.attendance.create({
      data: {
        userId,
        clockInAt: now,
        date: todayInBusinessTz,
        status,
        remark: dto.remark,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    await this.eventsService.publish('user.clocked_in', {
      attendanceId: newAttendance.id,
      userId: newAttendance.userId,
      userName: newAttendance.user.name,
      userEmail: newAttendance.user.email,
      clockInAt: newAttendance.clockInAt,
      status: newAttendance.status,
    });

    return newAttendance;
  }

  async clockOut(userId: number, dto: ClockOutDto) {
    const now = new Date();
    const todayInBusinessTz = this.getBusinessDate(now);

    const attendance = await this.prisma.attendance.findUnique({
      where: {
        userId_date: {
          userId,
          date: todayInBusinessTz,
        },
      },
    });

    if (!attendance) {
      throw new BadRequestException('You have not clocked in today');
    }

    if (attendance.clockOutAt) {
      throw new BadRequestException('You have already clocked out today');
    }

    const updatedAttendance = await this.prisma.attendance.update({
      where: { id: attendance.id },
      data: {
        clockOutAt: new Date(),
        remark: dto.remark ?? attendance.remark,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    await this.eventsService.publish('user.clocked_out', {
      attendanceId: updatedAttendance.id,
      userId: updatedAttendance.userId,
      userName: updatedAttendance.user.name,
      userEmail: updatedAttendance.user.email,
      clockOutAt: updatedAttendance.clockOutAt,
    });

    return updatedAttendance;
  }

  async getAttendanceList(userId: number, query: QueryAttendanceDto) {
    const dateFilter = this.buildDateFilter(query);

    return this.prisma.attendance.findMany({
      where: { userId, ...(dateFilter && { date: dateFilter }) },
      orderBy: { date: 'desc' },
    });
  }

  private buildDateFilter(query: QueryAttendanceDto) {
    if (!query.startDate && !query.endDate) {
      return undefined;
    }

    const filter: { gte?: Date; lte?: Date } = {};
    if (query.startDate) filter.gte = this.getBusinessDate(query.startDate);
    if (query.endDate) filter.lte = this.getBusinessDate(query.endDate);

    return filter;
  }

  private getBusinessDate(input: Date | string): Date {
    const utcInstant = typeof input === 'string' ? new Date(input) : input;
    const zoned = toZonedTime(utcInstant, this.businessTimezone);
    return new Date(
      Date.UTC(zoned.getFullYear(), zoned.getMonth(), zoned.getDate()),
    );
  }

  private getBusinessHour(utcInstant: Date): number {
    const zoned = toZonedTime(utcInstant, this.businessTimezone);
    return zoned.getHours();
  }
}
