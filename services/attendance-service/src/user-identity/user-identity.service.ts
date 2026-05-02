import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'prisma/prisma.service';
import { EventsService } from '../events/events.service';

@Injectable()
export class UserIdentityService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventsService: EventsService,
  ) {}

  async updateUser(userId: number, dto: UpdateUserDto) {
    const data: UpdateUserDto = {};

    if (dto.phoneNumber) data.phoneNumber = dto.phoneNumber;
    if (dto.photoUrl) data.photoUrl = dto.photoUrl;
    if (dto.password) {
      const hashedPassword = await bcrypt.hash(dto.password, 10);
      data.password = hashedPassword;
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data,
      select: this.userFields(),
    });

    const changedFields = Object.keys(data).filter((k) => k !== 'password');
    const passwordChanged = data.password !== undefined;

    await this.eventsService.publish('user.profile_updated', {
      userId: user.id,
      userName: user.name,
      changedFields: [
        ...changedFields,
        ...(passwordChanged ? ['password'] : []),
      ],
    });

    return user;
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
}
