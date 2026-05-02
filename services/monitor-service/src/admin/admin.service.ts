import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { QueryUserDto } from './dto/query-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryAttendanceDto } from './dto/query-attendance.dto';
import { toZonedTime } from 'date-fns-tz';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminService {
  private readonly businessTimezone: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.businessTimezone =
      this.configService.get<string>('BUSINESS_TIMEZONE') ?? 'UTC';
  }

  async getUserList(query: QueryUserDto) {
    return this.prisma.user.findMany({
      where: {
        ...(query.searchKeyword && {
          OR: [
            { name: { contains: query.searchKeyword, mode: 'insensitive' } },
            { email: { contains: query.searchKeyword, mode: 'insensitive' } },
          ],
        }),
        ...(query.role && { role: query.role }),
      },
      select: this.userFields(),
      orderBy: { createdAt: 'desc' },
    });
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

    return user;
  }

  async updateUser(id: number, dto: UpdateUserDto) {
    // Check user
    await this.getUser(id);

    if (dto.email) {
      const emailExist = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      if (emailExist && emailExist.id !== id) {
        throw new ConflictException('Email already in use');
      }
    }

    return this.prisma.user.update({
      where: { id },
      data: dto,
      select: this.userFields(),
    });
  }

  async deleteUser(id: number) {
    // Check user
    await this.getUser(id);

    return this.prisma.user.delete({
      where: { id },
      select: { id: true },
    });
  }

  async getAttendanceList(query: QueryAttendanceDto) {
    const dateFilter = this.buildDateFilter(query);

    return this.prisma.attendance.findMany({
      where: {
        ...(query.userId && { userId: query.userId }),
        ...(dateFilter && { date: dateFilter }),
      },
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
    });
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
    if (!query.startDate && !query.end_date) {
      return undefined;
    }

    const filter: { gte?: Date; lte?: Date } = {};
    if (query.startDate) filter.gte = this.getBusinessDate(query.startDate);
    if (query.end_date) filter.lte = this.getBusinessDate(query.end_date);

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
