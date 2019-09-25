
import { Get, Post, Body, Param, Controller, UsePipes  } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { Notification } from './notification.entity';
import NotificationDto from './notification.dto';
import { ValidationPipe } from '../common/validation.pipe';

@Controller('notification')
export class NotificationController {

  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  async findAll(): Promise<Notification[]> {
    return this.notificationService.findAll();
  }

  @Get('/:id')
  async findById(@Param() params): Promise<Notification> {
    return this.notificationService.findById(parseInt(params.id));
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() notification: NotificationDto) {
    this.notificationService.create(notification);
  }

  @Post('/:id')
  @UsePipes(new ValidationPipe())
  async update(@Param() id: number, @Body() notification: NotificationDto) {
    const thisNotification = await this.notificationService.findById(id);
    thisNotification.set(notification);
    await thisNotification.save();
    return thisNotification;
  }

  // TODO:
  @Get('/:id')
  async getNotifications(@Param() id: number): Promise<Notification> {

  }

}
