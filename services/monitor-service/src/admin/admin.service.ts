import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { QueryUserDto } from './dto/query-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryAttendanceDto } from './dto/query-attendance.dto';
import { toZonedTime } from 'date-fns-tz';
import { ConfigService } from '@nestjs/config';
import { EventsService } from '../events/events.service';

@Injectable()
export class AdminService {
  private readonly businessTimezone: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly eventsService: EventsService,
  ) {
    this.businessTimezone =
      this.configService.get<string>('BUSINESS_TIMEZONE') ?? 'UTC';
  }

  async getUserList(query: QueryUserDto) {
    const where = {
      ...(query.searchKeyword && {
        OR: [
          {
            name: {
              contains: query.searchKeyword,
              mode: Prisma.QueryMode.insensitive,
            },
          },
          {
            email: {
              contains: query.searchKeyword,
              mode: Prisma.QueryMode.insensitive,
            },
          },
        ],
      }),
      ...(query.role && { role: query.role }),
    };

    const pageNo = query.pageNo ?? 1;
    const pageSize = query.pageSize ?? 10;
    const skip = (pageNo - 1) * pageSize;

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        select: this.userFields(),
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
      }),
      this.prisma.user.count({ where }),
    ]);

    return { data, totalRecords: total, pageNo, pageSize };
  }

  async getUser(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: this.userFields(),
    });

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async createUser(dto: CreateUserDto) {
    // Check existing email
    const emailExist = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (emailExist) {
      throw new ConflictException('Email already registered');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Store to DB
    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,

        password: hashedPassword,
        phoneNumber: dto.phoneNumber,
        role: dto.role,
        position: dto.position,
      },
      select: this.userFields(),
    });

    await this.eventsService.publish('user.created', {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    return user;
  }

  async updateUser(id: number, dto: UpdateUserDto) {
    await this.getUser(id);

    if (dto.email) {
      const emailExist = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      if (emailExist && emailExist.id !== id) {
        throw new ConflictException('Email already in use');
      }
    }

    const { password, ...rest } = dto;
    const data = {
      ...rest,
      ...(password && { password: await bcrypt.hash(password, 10) }),
    };

    const user = await this.prisma.user.update({
      where: { id },
      data,
      select: this.userFields(),
    });

    await this.eventsService.publish('user.updated', {
      userId: user.id,
      changes: dto,
    });

    return user;
  }

  async deleteUser(id: number) {
    // Check user
    const user = await this.getUser(id);

    await this.prisma.user.delete({
      where: { id },
      select: { id: true },
    });

    await this.eventsService.publish('user.deleted', {
      userId: id,
      name: user.name,
      email: user.email,
    });

    return { id };
  }

  async getAttendanceList(query: QueryAttendanceDto) {
    const dateFilter = this.buildDateFilter(query);
    const where = {
      ...(query.userId && { userId: query.userId }),
      ...(dateFilter && { date: dateFilter }),
    };

    const pageNo = query.pageNo ?? 1;
    const pageSize = query.pageSize ?? 10;
    const skip = (pageNo - 1) * pageSize;

    const [data, total] = await Promise.all([
      this.prisma.attendance.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              position: true,
            },
          },
        },
        orderBy: [{ date: 'desc' }, { clockInAt: 'desc' }],
        skip,
        take: pageSize,
      }),
      this.prisma.attendance.count({ where }),
    ]);

    return { data, totalRecords: total, pageNo, pageSize };
  }

  private userFields() {
    return {
      id: true,
      email: true,
      name: true,
      phoneNumber: true,
      position: true,
      photoUrl: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    };
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
}
