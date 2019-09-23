
import { Notification } from './notification.entity';


export const NotificationProvider = [
  {
    provide: 'NOTIFICATION_REPOSITORY',
    useValue: Notification,
  },
];

