
import { Injectable, Inject } from '@nestjs/common';
import { Notification } from './notification.entity';
import { NotificationInterface } from './notification.interface';
import { NotificationConstants, NotificationStatus } from './constants';
import { LocationTimestamp } from '../locationTimestamp/locationTimestamp.entity';
import { Worker } from '../worker/worker.entity';
import { isEmpty, isNil } from 'lodash';
import * as moment from 'moment';

@Injectable()
export class NotificationService {

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

  async getNotifications(filterWorkerId: number = null): Promise<Notification[]> {
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

  async addNotification(workerId: number, category: string, description: string, worker: Worker = null, mustEmail: boolean = false,
                        fakeSmsSent: boolean = false)
    : Promise<void> {
    if (worker == null) {
      // todo throw sitemate exception
      // throw new SiteM8Exception("Worker not found with ID of " + workerId);
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
        // 	throw new SiteM8Exception("User does not have email address, yet requires a mandatory email notification");
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

  async addPasswordResetNotification(workerId: number, url: string, worker: Worker): Promise<void> {
    if (url == null) {
      // Todo: sitemate exception here
    }
    const message: string = `To reset your SiteM8 password: ${url}`;
    this.addNotification(workerId, NotificationConstants.CategoryPasswordReset, message, worker, true);
  }

  async addWelcomeNotification(workerId: number, url: string, worker: Worker): Promise<void> {
    const message: string = `Welcome to SiteM8. To set your password: ${url}`;
    this.addNotification(workerId, NotificationConstants.CategoryPasswordReset, message, worker, true);
  }

  async addDeviceNotification(workerId: number, worker: Worker): Promise<void> {
    const message: string = `Please check your SiteM8 device is charging.`;
    this.addNotification(workerId, NotificationConstants.CategoryPasswordReset, message, worker);
  }

  async addSosNotification(workerId: number, workerNeedingHelp: Worker, locationTimestamp: LocationTimestamp,
                           sitename: string, worker: Worker): Promise<void> {
    const when: Date = locationTimestamp.creationDateTime;
    let message: string = `SOS button activated for ${workerNeedingHelp.name} at ${moment(when).format('ddd HH:mm')}`;

    if (locationTimestamp.closestSiteDistance != null) {
      try {
        message += ` at ${sitename}`;
      } catch (Exception) {
        // todo : logger
        // logger.Error("Exception caught trying to append the site name for SOS notification");
      }
    }
    this.addNotification(workerId, NotificationConstants.CategorySOS, message, worker);

    message = `Last known location at ${moment(locationTimestamp.locationDateTime).format('ddd HH:mm')} is ` +
    `https://www.google.com/maps/search/?api=1&query=${locationTimestamp.latitude},${locationTimestamp.longitude}`;

    this.addNotification(workerId, NotificationConstants.CategorySOS, message, worker);
  }

  // TODO send worker specific notifications to the correct supervisor
  // TODO send admin a notification for all the workers
  async addAttendanceNotification(supervisorId: number, onSiteWorkers: Worker[], offSiteWorkers: Worker[]): Promise<void> {
    const total: number = onSiteWorkers.length + offSiteWorkers.length;

    let message: string = `${onSiteWorkers.length} out of ${total} workers have arrived today.`;
    if (offSiteWorkers.length > 0) {
      message += ' Not arrived yet: ';
      offSiteWorkers.forEach((worker: Worker) => {
        message += ', ' + worker.name;
      });
    }
    this.addNotification(supervisorId, NotificationConstants.CategoryAttendance, message);
  }
  async addSosAcknowledgementNotification(workerId: number, count: number) {
    const message: string = `${count} ${count > 1 ? 'people' : 'person'} notified about your SiteM8 help request.`;
    this.addNotification(workerId, NotificationConstants.CategorySOSConfirmation, message);
  }

  async addTimesheetDailyNotification(workerId: number, date: Date, hours: number, minutes: number, websiteForWorkers: string) {
    const message: string = `Your SiteM8 timesheet for ${moment(date).format('ddd')} is ${hours} hours ${minutes} min.` +
      `For any concerns please reply or visit ${websiteForWorkers}`;
    this.addNotification(workerId, NotificationConstants.CategoryTimesheet, message);
  }

  async addApprovalReminderNotification(workerId: number, timesheetCount: number, websiteForSupervisors: string) {
    const message: string = `There are ${timesheetCount} timesheets requiring approval at ${websiteForSupervisors}`;
    this.addNotification(workerId, NotificationConstants.CategoryApprovalReminder, message);
  }

  async addTimesheetWeeklyNotification(workerId: number, date: number, hours: number, minutes: number, websiteForWorkers: string) {
    const message: string = `Your SiteM8 timesheet for week ending ${moment(date).format('d MMM')} is ${hours} hours ${minutes} min.` +
     `For any concerns please reply or visit ${websiteForWorkers}`;
    this.addNotification(workerId, NotificationConstants.CategoryTimesheet, message);
  }

  // todo:  GetLink(int workerId)

  async addTestSmsSentNotification(workerId: number) {
    const message: string = 'Test notification';
    this.addNotification(workerId, NotificationConstants.CategoryDevice, message, null, false, true);
  }

}
