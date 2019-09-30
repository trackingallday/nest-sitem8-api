
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
    console.log(blockedIds[0])
    const closestSiteId = await this.siteService.getClosestAssignedSiteId(
      loc.latitude, loc.longitude, blockedIds[0], req.dbUser.companyId);
    const closestSiteDistance = await this.siteService.getDistanceToSite(
      closestSiteId, loc.latitude, loc.longitude);

    const device = await this.deviceService.findOneWhere({ where: { deviceId: loc.deviceId } });
    console.log({ ...loc, closestSiteId, closestSiteDistance, workerId: worker.id, deviceId: device.id });
    const fullLoc = { ...loc, closestSiteId, closestSiteDistance, workerId: worker.id, deviceId: device.id };
    return await this.locationTimestampService.create(fullLoc);
    return "Sdfsdfsdf"

  }

}
