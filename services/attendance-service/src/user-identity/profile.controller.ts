import { Controller, Patch, Body, Get, UseGuards } from '@nestjs/common';
import { UserIdentityService } from './user-identity.service';
import { CurrentUser } from './decorators/current-user.decorator';
import type { User } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private readonly userIdentityService: UserIdentityService) {}

  @Get()
  getUser(@CurrentUser() user: User) {
    return user;
  }

  @Patch()
  updateUser(@CurrentUser() user: User, @Body() dto: UpdateUserDto) {
    return this.userIdentityService.updateUser(user.id, dto);
  }
}
