import { Injectable, Inject } from '@nestjs/common';
import { Op } from 'sequelize';
import { Notification } from './notification.entity';
import { NotificationInterface } from './notification.interface';
import { NotificationConstants, NotificationStatus } from './constants';
import { LocationTimestamp } from '../locationTimestamp/locationTimestamp.entity';
import { Worker } from '../worker/worker.entity';
import { sendSMS } from '../common/send.sms';
import { Email } from '../common/send.email';
import * as moment from 'moment';

@Injectable()
export class NotificationService {

  @Inject('NOTIFICATION_REPOSITORY') private readonly NOTIFICATION_REPOSITORY: typeof Notification;
  private readonly emailGateway = new Email();

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

  async getNotifications(workerId: number = null): Promise<Notification[]> {
    return await this.NOTIFICATION_REPOSITORY.findAll<Notification>(
      {
        where: { workerId },
        limit: NotificationConstants.MaximumRecords,
      },
    );
  }

  async getUnsentNotificationsAnyCompany(): Promise<Notification[]> {
    return await this.NOTIFICATION_REPOSITORY.findAll<Notification>(
      {
        where: {
          [Op.or]: [
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
    const notification = await this.findById(id);
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
          [Op.and]: {
            workerId ,
            smsSentDateTime : { [Op.ne]: null },
          },
        },
        order: [ 'smsSentDateTime' ],
        limit: 1,
      },
    );
  }

  async addNotification(category: string, description: string, worker: Worker)
    : Promise<Notification> {
    // Create the notification.
    const notification: any = {
      workerId: worker.id,
      category,
      description: description.length <= 160 ? description : description.substring(0, 160),
      smsStatus: (worker.mobile && worker.mobileNotifications) ? NotificationStatus.Pending : NotificationStatus.NotSent,
      emailStatus: worker.email ? NotificationStatus.Pending : NotificationStatus.NotSent,
      emailAddress: worker.email && worker.email,
      mobileNumber: worker.mobile && worker.mobile,
    };

    // Send sms
    if (notification.smsStatus === NotificationStatus.Pending) {
      const response: any = await sendSMS(worker.mobile, notification.description);
      if (response.code === 200) {
        notification.smsSentDateTime =  moment().utc().toDate();
        notification.smsStatus = NotificationStatus.Sent;
      } else if (response.code !== 500) {
        notification.smsStatus = NotificationStatus.Error;
      }
    }

    // Send email
    if (notification.emailStatus === NotificationStatus.Pending) {
      try {
        const companyName = notification.worker.company.name;
        const response: any = await this.emailGateway.sendMail(
          notification.description,
          notification.emailAddress,
          notification.category,
          companyName,
          );
        if (response.code === 200) {
          notification.emailSentDateTime =  moment().utc().toDate();
          notification.emailStatus = NotificationStatus.Sent;
        } else if (response.code !== 500) {
          notification.emailStatus = NotificationStatus.Error;
        }
      } catch {
        // todo:
        // logger.Error($'Failed to determine the company name for notification {notification.NotificationId}');
      }
    }
    return await this.NOTIFICATION_REPOSITORY.create(notification);
  }

  async addPasswordResetNotification(worker: Worker, url: string): Promise<void> {
    const message: string = `To reset your SiteM8 password: ${url}`;
    this.addNotification(NotificationConstants.CategoryPasswordReset, message, worker);
  }

  async addWelcomeNotification(url: string, worker: Worker): Promise<void> {
    const message: string = `Welcome to SiteM8. To set your password: ${url}`;
    this.addNotification(NotificationConstants.CategoryPasswordReset, message, worker);
  }

  async addDeviceNotification(worker: Worker): Promise<void> {
    const message: string = `Please check your SiteM8 device is charging.`;
    this.addNotification(NotificationConstants.CategoryDevice, message, worker);
  }

  async addSosNotification(user: Worker, workerNeedingHelp: Worker, locationTimestamp: LocationTimestamp,
                           sitename: string): Promise<void> {
    const when: Date = locationTimestamp.creationDateTime;
    let message: string = `SOS button activated for ${workerNeedingHelp.name} at ${moment(when).format('ddd HH:mm')}`;

    if (locationTimestamp.closestSiteDistance != null) {
        message += ` at ${sitename}`;
    }
    this.addNotification(NotificationConstants.CategorySOS, message, user);

    message = `Last known location at ${moment(locationTimestamp.locationDateTime).format('ddd HH:mm')} is ` +
    `https://www.google.com/maps/search/?api=1&query=${locationTimestamp.latitude},${locationTimestamp.longitude}`;

    this.addNotification(NotificationConstants.CategorySOS, message, user);
  }

  // TODO send worker specific notifications to the correct supervisor
  // TODO send admin a notification for all the workers
  async addAttendanceNotification(supervisor: Worker, onSiteWorkers: Worker[], offSiteWorkers: Worker[]): Promise<void> {
    const total: number = onSiteWorkers.length + offSiteWorkers.length;

    let message: string = `${onSiteWorkers.length} out of ${total} workers have arrived today.`;
    if (offSiteWorkers.length > 0) {
      message += ' Not arrived yet: ';
      offSiteWorkers.forEach((worker: Worker) => {
        message += ', ' + worker.name;
      });
    }
    this.addNotification(NotificationConstants.CategoryAttendance, message, supervisor);
  }

  async addSosAcknowledgementNotification(user: Worker, count: number) {
    const message: string = `${count} ${count > 1 ? 'people' : 'person'} notified about your SiteM8 help request.`;
    this.addNotification(NotificationConstants.CategorySOSConfirmation, message, user);
  }

  async addTimesheetDailyNotification(worker: Worker, date: Date, hours: number, minutes: number, websiteForWorkers: string) {
    const message: string = `Your SiteM8 timesheet for ${moment(date).format('ddd')} is ${hours} hours ${minutes} min.` +
      `For any concerns please reply or visit ${websiteForWorkers}`;
    this.addNotification(NotificationConstants.CategoryTimesheet, message, worker);
  }

  async addApprovalReminderNotification(worker: Worker, timesheetCount: number, websiteForSupervisors: string) {
    const message: string = `There are ${timesheetCount} timesheets requiring approval at ${websiteForSupervisors}`;
    this.addNotification(NotificationConstants.CategoryApprovalReminder, message, worker);
  }

  async addTimesheetWeeklyNotification(worker: Worker, date: number, hours: number, minutes: number, websiteForWorkers: string) {
    const message: string = `Your SiteM8 timesheet for week ending ${moment(date).format('d MMM')} is ${hours} hours ${minutes} min.` +
     `For any concerns please reply or visit ${websiteForWorkers}`;
    this.addNotification(NotificationConstants.CategoryTimesheet, message, worker);
  }

}
