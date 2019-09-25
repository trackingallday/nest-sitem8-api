
import { Injectable, Inject } from '@nestjs/common';
import { Notification } from './notification.entity';
import { NotificationInterface } from './notification.interface';
import { NotificationConstants, NotificationStatus } from './constants';
import { WorkerService } from '../worker/worker.service';
import { Worker } from '../worker/worker.entity';
import { isEmpty, isNil } from 'lodash';

@Injectable()
export class NotificationService {

  constructor(private readonly workerService: WorkerService) {}

  @Inject('NOTIFICATION_REPOSITORY') private readonly NOTIFICATION_REPOSITORY: typeof Notification;

  async findAll(): Promise<Notification[]> {
    return await this.NOTIFICATION_REPOSITORY.findAll<Notification>();
  }

  async create(props: NotificationInterface): Promise<Notification> {
    return await this.NOTIFICATION_REPOSITORY.create<Notification>(props);
  }

  async findAllWhere(props): Promise<Notification[]> {
    return await this.NOTIFICATION_REPOSITORY.findAll<Notification>(props);
  }

  async findOneWhere(props): Promise<Notification> {
    return await this.NOTIFICATION_REPOSITORY.findOne<Notification>(props);
  }

  async findById(id): Promise<Notification> {
    return await this.NOTIFICATION_REPOSITORY.findByPk<Notification>(id);
  }

  async getNotifications(filterWorkerId: number): Promise<Notification[]> {
    return await this.NOTIFICATION_REPOSITORY.findAll<Notification>(
      {
        where: { workerId: filterWorkerId },
        limit: NotificationConstants.MaximumRecords,
      },
    );
  }

  async getUnsentNotificationsAnyCompany(): Promise<Notification[]> {
    return await this.NOTIFICATION_REPOSITORY.findAll<Notification>(
      {
        where: {
          $or: [
            { smsStatus: { $like: NotificationStatus.Pending } },
            { emailStatus: { $like: NotificationStatus.Pending } },
          ],
        },
        limit: NotificationConstants.MaximumRecords,
      },
    );
  }

  async addNotificationToDb(notification: NotificationInterface): Promise<void> {
    await this.create(notification);
  }

  async updateOne(id: number, props: any): Promise<Notification> {
    const notification = await this.findById(props);
    notification.set(props);
    await notification.save();
    return notification;
  }

  async saveNotification(id: number, props: any): Promise<Notification> {
    return this.updateOne(id, props);
  }

  async getLastSmsNotificationSent(workerId: number): Promise<Notification> {
    return await this.NOTIFICATION_REPOSITORY.findOne<Notification>(
      {
        where: {
          $and: {
            workerId ,
            smsSentDateTime : { $not: null },
          },
        },
        order: [ 'smsSentDateTime' ],
        limit: 1,
      },
    );
  }

  async addNotification(workerId: number, category: string, description: string, mustEmail: boolean = false, fakeSmsSent: boolean = false)
    : Promise<void> {
    const worker: Worker = await this.workerService.findById(workerId);
    if (worker == null) {
      // todo throw sitemate exception
    }
    // Create the notification.
    const notification: Notification = new Notification({
      workerId,
      category,
      description : description.length <= 160 ? description : description.substring(0, 160),
      emailStatus : NotificationStatus.NotSent,
      smsStatus : NotificationStatus.NotSent,
      emailAddress : ``,
      mobileNumber : ``,
    });

    // Certain notifications must be emailed regardless of whether the user has opted for email notifications.
    if (worker.emailNotifications || mustEmail) {
      if (isNil(worker.email) || isEmpty(worker.email)) {
        // throw exception
      }
      notification.emailAddress = worker.email;
      notification.emailStatus = NotificationStatus.Pending;
    }

    if (worker.mobileNotifications) {
      notification.mobileNumber = worker.mobile;
      notification.smsStatus = NotificationStatus.Pending;
    }

    // Needed for testing.
    if (fakeSmsSent) {
      notification.smsSentDateTime = new Date(2000, 1, 10);
      notification.smsStatus = NotificationStatus.Sent;
    }
    this.NOTIFICATION_REPOSITORY.create(notification);
  }

  async addPasswordResetNotification(workerId: number, url: string): Promise<void> {
    if (url == null) {
      // Todo: sitemate exception here
    }
    const message: string = `To reset your SiteM8 password: ${url}`;
    this.addNotification(workerId, NotificationConstants.CategoryPasswordReset, message, true);
  }

  async addWelcomeNotification(workerId: number, url: string): Promise<void> {
    const message: string = `Welcome to SiteM8. To set your password: ${url}`;
    this.addNotification(workerId, NotificationConstants.CategoryPasswordReset, message, true);
  }

  async addDeviceNotification(workerId: number): Promise<void> {
    const message: string = `Please check your SiteM8 device is charging.`;
    this.addNotification(workerId, NotificationConstants.CategoryPasswordReset, message);
  }

  // todo : AddSosNotification in notification manager onwards

}
