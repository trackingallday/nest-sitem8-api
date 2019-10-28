
import { Get, Post, Body, Param, Controller, UsePipes  } from '@nestjs/common';
import { SiteAssignmentService } from './siteAssignment.service';
import { SiteAssignment } from './siteAssignment.entity';
import SiteAssignmentDto from './siteAssignment.dto';
import { ValidationPipe } from '../common/validation.pipe';
import { AddSiteAssignmentParams } from './siteAssignment.interface';
import { DayOfWeekTimeSettingService } from '../dayOfWeekTimeSetting/dayOfWeekTimeSetting.service';
import { WorkerAssignmentService } from '../workerAssignment/workerAssignment.service';
import { NotificationService } from '../notification/notification.service';
import { NotificationConstants } from '../notification/constants';
import { WorkerAssignment } from '../workerAssignment/workerAssignment.entity';
import { isNil, isEmpty } from 'lodash';

@Controller('siteAssignment')
export class SiteAssignmentController {

  constructor(
    private readonly siteAssignmentService: SiteAssignmentService,
    private readonly dayOfWeekTimeSettingService: DayOfWeekTimeSettingService,
    private readonly workerAssignmentService: WorkerAssignmentService,
    private readonly notificationService: NotificationService,
    ) {}

  @Get()
  async findAll(): Promise<SiteAssignment[]> {
    return this.siteAssignmentService.findAll();
  }

  @Get('/:id')
  async findById(@Param() params): Promise<SiteAssignment> {
    return this.siteAssignmentService.findById(parseInt(params.id));
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() siteAssignment: SiteAssignmentDto) {
    this.siteAssignmentService.create(siteAssignment);
  }

  @Post('/:id')
  @UsePipes(new ValidationPipe())
  async update(@Param() id: number, @Body() siteAssignment: SiteAssignmentDto) {
    const thisSiteAssignment = await this.siteAssignmentService.findById(id);
    thisSiteAssignment.set(siteAssignment);
    await thisSiteAssignment.save();
    return thisSiteAssignment;
  }

  @Post('addsiteassignment')
  @UsePipes(new ValidationPipe())
  async addAssignment(@Body() addSiteAssignmentParams: AddSiteAssignmentParams) {
    const siteAssignment: SiteAssignment = await this.siteAssignmentService.addSiteAssignment(addSiteAssignmentParams);
    const savedAssignment: SiteAssignment = await this.siteAssignmentService.findSiteAssignmentWithChilds(siteAssignment.id);
    if (isNil(savedAssignment.workerAssignments) || isEmpty(savedAssignment.workerAssignments)) { return; }
    savedAssignment.workerAssignments.forEach((x: WorkerAssignment) => {
      this.notificationService.addNotification(NotificationConstants.CategoryAssignment, addSiteAssignmentParams.message, x.worker);
    });

    return savedAssignment;
  }
}
