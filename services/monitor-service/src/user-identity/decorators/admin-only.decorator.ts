import { applyDecorators, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from './roles.decorator';

export const AdminOnly = () =>
  applyDecorators(UseGuards(JwtAuthGuard, RolesGuard), Roles(Role.ADMIN));
