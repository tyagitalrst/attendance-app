import { Module } from '@nestjs/common';
import { RolesGuard } from './guards/roles.guard';
import { ProfileController } from './profile.controller';
import { UserIdentityService } from './user-identity.service';
import { EventsModule } from '../events/events.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [EventsModule, AuthModule],
  providers: [RolesGuard, UserIdentityService],
  exports: [RolesGuard],
  controllers: [ProfileController],
})
export class UserIdentityModule {}
