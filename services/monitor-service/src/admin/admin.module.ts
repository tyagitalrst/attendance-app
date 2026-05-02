import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AuthModule } from '../auth/auth.module';
import { UserIdentityModule } from '../user-identity/user-identity.module';

@Module({
  imports: [AuthModule, UserIdentityModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
