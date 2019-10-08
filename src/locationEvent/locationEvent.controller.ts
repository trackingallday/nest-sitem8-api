
import { Get, Post, Body, Param, Controller, UsePipes, Req  } from '@nestjs/common';
import { DeviceService } from '../device/device.service';
import { SiteService } from '../site/site.service';
import { SiteAssignmentService } from '../siteAssignment/siteAssignment.service';
import { WorkerService } from '../worker/worker.service';
import { LocationTimestampService } from '../locationTimestamp/locationTimestamp.service';
import { LocationEventService } from './locationEvent.service';

import { ValidationPipe } from '../common/validation.pipe';


@Controller('locationTimestamp')
export class LocationTimestampController {

  constructor(
    private readonly locationEventService: LocationEventService,
    private readonly locationTimestampService: LocationTimestampService,
    ) {

    }


}
