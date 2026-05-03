import { Body, Controller, Post } from '@nestjs/common';
import { AdminOnly } from '../user-identity/decorators/admin-only.decorator';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
@AdminOnly()
export class NotificationsController {
  constructor(private readonly notifications: NotificationsService) {}

  @Post('subscribe')
  async subscribe(@Body() body: { token: string }) {
    await this.notifications.subscribeAdminToTopic(body.token);
    return { success: true };
  }
}
