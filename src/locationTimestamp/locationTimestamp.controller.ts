
import { Get, Post, Body, Param, Controller, UsePipes, Req, Inject, forwardRef  } from '@nestjs/common';
import { LocationTimestampService } from './locationTimestamp.service';
import { LocationEventService } from '../locationEvent/locationEvent.service';
import { DeviceService } from '../device/device.service';
import { SiteService } from '../site/site.service';
import { SiteAssignmentService } from '../siteAssignment/siteAssignment.service';
import { WorkerService } from '../worker/worker.service';
import { LocationTimestamp } from './locationTimestamp.entity';
import LocationTimestampDto from './locationTimestamp.dto';
import { ValidationPipe } from '../common/validation.pipe';
import { Company } from '../company/company.entity';
import * as momenttz from 'moment-timezone';

@Controller('locationTimestamp')
export class LocationTimestampController {

  constructor(
    private readonly locationTimestampService: LocationTimestampService,
    private readonly deviceService: DeviceService,
    private readonly siteService: SiteService,
    private readonly siteAssignmentService: SiteAssignmentService,
    private readonly workerService: WorkerService,
    @Inject(forwardRef(() => LocationEventService))
    private readonly locationEventService: LocationEventService,
    ) {

    }

  @Get()
  async findAll(): Promise<LocationTimestamp[]> {
    return this.locationTimestampService.findAll();
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Req() req, @Body() loc: LocationTimestampDto) {

    const worker = await this.workerService.findOneWhere({
      where: { deviceId: loc.deviceId },
      include: [Company],
    });

    const tenMinutesAgo = momenttz(loc.locationDateTime).subtract(10, 'minutes').toDate();

    const previousLocs = await this.locationTimestampService.findByDeviceIdDateRange(tenMinutesAgo, loc.locationDateTime, loc.deviceId);

    const blockedIds = await this.siteAssignmentService.getBlockedSiteIdsByWorkerId(
      req.dbUser.id);

    const closestSiteId = await this.siteService.getClosestAssignedSiteId(
      loc.latitude, loc.longitude, blockedIds, req.dbUser.companyId);

    const closestSiteDistance = await this.siteService.getDistanceToSite(
      closestSiteId, loc.latitude, loc.longitude);

    const fullLoc = { ...loc, closestSiteId, closestSiteDistance, workerId: worker.id };

    const locTimestamp = await this.locationTimestampService.create(fullLoc);
    const locEvent = await this.locationEventService.createFromLocationTimestamp(locTimestamp, previousLocs,
      worker.company, worker.company);
    locTimestamp.locationEvent = locEvent;
    return locTimestamp;
  }

  @Get('/latestlocationtimestamps')
  async getLatestLocations(@Req() req) {
    const workers = await this.workerService.findAllWhere({
      where: {
        companyId: req.dbUser.companyId,
        isEnabled: true,
      },
      attributes: ['id'],
    });
    const ids:number[] = workers.map(w => w.toJSON()['id']);
    // tslint:disable-next-line
    const locs = await this.locationTimestampService.getLatestByWorkerIds(ids);
    return locs;
  }
}
