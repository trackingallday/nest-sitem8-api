
import { Get, Post, Body, Param, Controller, UsePipes, Req  } from '@nestjs/common';
import { LocationTimestampService } from './locationTimestamp.service';
import { DeviceService } from '../device/device.service';
import { SiteService } from '../site/site.service';
import { SiteAssignmentService } from '../siteAssignment/siteAssignment.service';
import { WorkerService } from '../worker/worker.service';
import { LocationTimestamp } from './locationTimestamp.entity';
import LocationTimestampDto from './locationTimestamp.dto';
import { ValidationPipe } from '../common/validation.pipe';


@Controller('locationTimestamp')
export class LocationTimestampController {

  constructor(
    private readonly locationTimestampService: LocationTimestampService,
    private readonly deviceService: DeviceService,
    private readonly siteService: SiteService,
    private readonly siteAssignmentService: SiteAssignmentService,
    private readonly workerService: WorkerService,
    ) {

    }

  @Get()
  async findAll(): Promise<LocationTimestamp[]> {
    return this.locationTimestampService.findAll();
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Req() req, @Body() loc: LocationTimestampDto) {
    const worker = await this.workerService.findOneWhere({ where: { deviceId: loc.deviceId }});

    const blockedIds = await this.siteAssignmentService.getBlockedSiteIdsByWorkerId(
      req.dbUser.id);

    const closestSiteId = await this.siteService.getClosestAssignedSiteId(
      loc.latitude, loc.longitude, blockedIds, req.dbUser.companyId);


    const closestSiteDistance = await this.siteService.getDistanceToSite(
      closestSiteId, loc.latitude, loc.longitude);
    const device = await this.deviceService.findOneWhere({ where: { deviceId: loc.deviceId } });
    const fullLoc = { ...loc, closestSiteId, closestSiteDistance, workerId: worker.id, deviceId: device.id };
    return await this.locationTimestampService.create(fullLoc);
  }

  @Get('/latestlocationtimestamps')
  async getLatestLocations(@Req() req) {
    var workerRes = await this.workerService.findAllWhere({
      where: {
        companyId: req.dbUser.companyId,
        isEnabled: true,
      },
      attributes: ['id'],
    });
    const ids:number[] = workerRes.map(w => w.toJSON()['id']);
    // tslint:disable-next-line
    const locs = await this.locationTimestampService.getLatestByWorkerIds(ids);
    return locs;
  }


}
