import { Injectable } from '@nestjs/common';
import { Expo } from 'expo-server-sdk';

@Injectable()
export class ExpoPushService {
  private expo = new Expo();

  async sendPush(
    expoPushToken: string,
    payload: {
      title: string;
      body: string;
      data?: Record<string, any>;
    },
  ) {
    if (!Expo.isExpoPushToken(expoPushToken)) {
      throw new Error('Invalid Expo push token');
    }

    const messages = [
      {
        to: expoPushToken,
        sound: 'default',
        title: payload.title,
        body: payload.body,
        data: payload.data,
      },
    ];

    const tickets = await this.expo.sendPushNotificationsAsync(messages);

    return tickets;
  }
}
