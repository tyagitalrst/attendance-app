import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { EventsModule } from './events/events.module';
import { LogsModule } from './logs/logs.module';
import { UserIdentityModule } from './user-identity/user-identity.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    EventsModule,
    LogsModule,
    AuthModule,
    UserIdentityModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
