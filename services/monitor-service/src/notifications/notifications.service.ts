import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { existsSync, readFileSync } from 'fs';
import * as admin from 'firebase-admin';
import * as path from 'path';

interface AdminNotification {
  title: string;
  body: string;
  data?: Record<string, string>;
}

@Injectable()
export class NotificationsService implements OnModuleInit {
  private readonly logger = new Logger(NotificationsService.name);
  private adminTopic: string = '';
  private initialize = false;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    try {
      const credPath = this.configService.get<string>(
        'FIREBASE_CREDENTIALS_PATH',
      );
      this.adminTopic =
        this.configService.get<string>('FCM_ADMIN_TOPIC') ??
        'admin-notifications';

      if (!credPath) {
        this.logger.warn(
          'FIREBASE_CREDENTIALS_PATH not set. Notifications disabled.',
        );
        return;
      }

      const absolutePath = path.resolve(credPath);
      if (!existsSync(absolutePath)) {
        this.logger.warn(
          `Firebase credentials file not found at ${absolutePath}. Notifications disabled.`,
        );
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const serviceAccount = JSON.parse(readFileSync(absolutePath, 'utf8'));

      admin.initializeApp({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        credential: admin.credential.cert(serviceAccount),
      });

      this.initialize = true;
      this.logger.log('Firebase Admin SDK installed');
    } catch (err) {
      this.logger.error('Failed to initialize Firebase Admin', err);
    }
  }

  async notifyAdmins(notification: AdminNotification) {
    if (!this.initialize) {
      this.logger.warn(
        `Skipping notification (FCM not initialized): ${notification.title}`,
      );
      return;
    }

    try {
      const res = await admin.messaging().send({
        topic: this.adminTopic,
        notification: {
          title: notification.title,
          body: notification.body,
        },
        data: notification.data ?? {},
        webpush: {
          notification: {
            icon: '/notification-icon.png',
          },
          fcmOptions: {
            link: '/', // TO DO: modified later when develop web
          },
        },
      });
      this.logger.log(`Notification sent: "${notification.title}" → ${res}`);
    } catch (err) {
      this.logger.error(
        `Failed to send notification: ${notification.title}`,
        err,
      );
    }
  }
}
