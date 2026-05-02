import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { EventsService } from './events.service';
import { EVENTS_EXCHANGE } from './events.constants';

@Module({
  imports: [
    RabbitMQModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        exchanges: [
          {
            name: EVENTS_EXCHANGE,
            type: 'topic',
          },
        ],
        uri: config.get<string>('RABBITMQ_URL') ?? '',
        connectionInitOptions: { wait: false },
      }),
    }),
  ],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}
