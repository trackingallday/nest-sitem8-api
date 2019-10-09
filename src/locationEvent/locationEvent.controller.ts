
import { Get, Post, Body, Param, Controller, UsePipes, Req  } from '@nestjs/common';
import { CompanyService } from '../company/company.service';
import { SiteAssignmentService } from '../siteAssignment/siteAssignment.service'
import { LocationEventService } from './locationEvent.service';

import { ValidationPipe } from '../common/validation.pipe';


@Controller('locationEvent')
export class LocationEventController {

  constructor(
    private readonly locationEventService: LocationEventService,
    ) {

    }


}
