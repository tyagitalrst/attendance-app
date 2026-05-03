import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { AuthModule } from '../auth/auth.module';
import { UserIdentityModule } from '../user-identity/user-identity.module';
import { NotificationsController } from './notifications.controller';

@Module({
  providers: [NotificationsService],
  exports: [NotificationsService],
  imports: [AuthModule, UserIdentityModule],
  controllers: [NotificationsController],
})
export class NotificationsModule {}
