
import { Injectable, Inject } from '@nestjs/common';
import { Op } from 'sequelize';
import * as moment from 'moment';
import * as momenttz from 'moment-timezone';
import { LocationEvent } from './locationEvent.entity';
import { LocationTimestamp } from '../locationTimestamp/locationTimestamp.entity';
import { Company } from '../company/company.entity';
import { Worker } from '../worker/worker.entity';
import { SiteAssignment } from '../siteAssignment/siteAssignment.entity';
import { DayOfWeekTimeSetting } from '../dayOfWeekTimeSetting/dayOfWeekTimeSetting.entity';
import { WorkerAssignment } from '../workerAssignment/workerAssignment.entity';

//TODO make this company specific m
const maxSiteDistance = 50;


@Injectable()
export class LocationEventService {

  @Inject('LOCATIONEVENT_REPOSITORY') private readonly LOCATIONEVENT_REPOSITORY: typeof LocationEvent;
  //@Inject('COMPANY_REPOSITORY') private readonly COMPANY_REPOSITORY: typeof Company;
  @Inject('SITEASSIGNMENT_REPOSITORY') private readonly SITEASSIGNMENT_REPOSITORY: typeof SiteAssignment;

  //AddLocationTimestamp
  async create(props: any): Promise<LocationEvent> {
    return await this.LOCATIONEVENT_REPOSITORY.create<LocationEvent>(props);
  }

  async findAllWhere(props): Promise<LocationEvent[]> {
    return await this.LOCATIONEVENT_REPOSITORY.findAll<LocationEvent>(props);
  }

  // returns time settings or null if no dayofweektimesetting matches the same day as the  applicable
  // uses moment timezone since the day entered is in NZ time
  /*async getSiteTimeSettings(locationTimestamp: LocationTimestamp): Promise<any> {
    const siteAssignment = await this.SITEASSIGNMENT_REPOSITORY.findOne({
      where: {
        siteId: locationTimestamp.closestSiteId,
        archived: false,
      },
      include: [ DayOfWeekTimeSetting ],
    });

    if(!siteAssignment) {
      return null;
    }

    const { dayOfWeekTimeSettings } = siteAssignment;
    const dayOfWeek = momenttz(locationTimestamp.locationDateTime).tz('Pacific/Auckland').weekday();
    return dayOfWeekTimeSettings.find(d => d.dayInWeek == dayOfWeek) || null;
  }

  async createFromLocationTimestamp(locationTimestampId: number):Promise<LocationEvent> {

   /* const locationTimestamp: LocationTimestamp = await this.LOCATIONTIMESTAMP_REPOSITORY.findOne({
      where: { id: locationTimestampId },
      include: [{ model: Worker, include: [Company] }],
    });

    const { worker, locationDateTime, deviceId } = locationTimestamp;
    let timeSetting:any = await this.getSiteTimeSettings(locationTimestamp);
    timeSetting = timeSetting ? timeSetting : worker.company;

    const { workingDayLatestFinish, workingDayEarliestStart } = timeSetting;

    const compareDateStart = momenttz(locationTimestamp.locationDateTime).tz('Pacific/Auckland');
    compareDateStart;

    const isTooEarly = momenttz(locationTimestamp.locationDateTime).tz('Pacific/Auckland').isAfter(workingDayEarliestStart);
    const isTooLate = momenttz(locationTimestamp.locationDateTime).tz('Pacific/Auckland').isAfter(workingDayLatestFinish);

    if(!locationTimestamp.closestSiteId) {
      return await this.LOCATIONEVENT_REPOSITORY.create({
        locationTimestampId: locationTimestamp.id,
        eventType: 'off_site',
      });
    }


    // grab the last 20 minutes of locations;
    const recentLocations = this.LOCATIONEVENT_REPOSITORY.findAll({
      where: {
        locationDateTime: {
          [Op.gte]: moment(locationDateTime).subtract(20, 'minutes').toDate(),
          [Op.lt]: locationDateTime,
        },
        deviceId,
      },
      order: [
        ['location_date_time', 'DESC']
      ],
      include: [LocationEvent],
    });

    const { glitchRemovalPeriod } = locationTimestamp.worker.company;*/
    //return new LocationEvent();

  //}
}

