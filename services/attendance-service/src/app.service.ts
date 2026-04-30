import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  async getUsers() {
    const userCount = await this.prisma.user.count();
    return {
      status: 'ok',
      userCount,
      timestamp: new Date().toISOString(),
    };
  }
}
