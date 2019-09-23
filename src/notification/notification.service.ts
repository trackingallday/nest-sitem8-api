
import { Injectable, Inject } from '@nestjs/common';
import { Notification } from './notification.entity';
import { NotificationInterface } from './notification.interface';
import constants from '../constants'

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

}

