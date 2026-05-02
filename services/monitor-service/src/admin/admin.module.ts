import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AuthModule } from '../auth/auth.module';
import { UserIdentityModule } from '../user-identity/user-identity.module';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [AuthModule, UserIdentityModule, EventsModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
