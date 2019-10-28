
import { Injectable, Inject } from '@nestjs/common';
import { Op } from 'sequelize';
import * as momenttz from 'moment-timezone';
import { LocationEvent } from './locationEvent.entity';
import { LocationTimestamp } from '../locationTimestamp/locationTimestamp.entity';
import { Company } from '../company/company.entity';
import { Worker } from '../worker/worker.entity';
import { SiteAssignment } from '../siteAssignment/siteAssignment.entity';
import { DayOfWeekTimeSetting } from '../dayOfWeekTimeSetting/dayOfWeekTimeSetting.entity';
import { WorkerAssignment } from '../workerAssignment/workerAssignment.entity';
import { mtzFromDateTimeTZ, mtzFromTimeStr } from '../utils/dateUtils';
import { eventTypeEnum } from './constants';
import { sortBy } from 'lodash';

const { ENTER_SITE, EXIT_SITE, ON_SITE, OFF_SITE, PRIVACY_BLOCKED } = eventTypeEnum;


//TODO make all of these company specific settings
const maxSiteDistance = 75;
//max speed to care about 72KPH (anything higher is proabably inaccurate)
const maxAccuracySpeedMS = 20;
//39.6KPH max speed to be meaningful for enter exit
const maxEnterTotalSpeedMS = 11;
//32.4KPH max speed to be meaningful for enter exit
const maxEnterSpeedMS = 9;
//10.8KPH max speed to travel onto site
const maxOnSpeedMS = 3;
//meters outside accuracy bounds
const absoluteMaXOnSiteDistanceM = 250;
const tzStr= 'Pacific/Auckland';




@Injectable()
export class LocationEventService {

  @Inject('LOCATIONEVENT_REPOSITORY') private readonly LOCATIONEVENT_REPOSITORY: typeof LocationEvent;
  @Inject('SITEASSIGNMENT_REPOSITORY') private readonly SITEASSIGNMENT_REPOSITORY: typeof SiteAssignment;

  //AddLocationTimestamp
  async create(props: any): Promise<LocationEvent> {
    return await this.LOCATIONEVENT_REPOSITORY.create<LocationEvent>(props);
  }

  async findAllWhere(props): Promise<LocationEvent[]> {
    return await this.LOCATIONEVENT_REPOSITORY.findAll<LocationEvent>(props);
  }

  async findOneWhere(props): Promise<LocationEvent> {
    return await this.LOCATIONEVENT_REPOSITORY.findOne<LocationEvent>(props);
  }

  // returns time settings or null if no dayofweektimesetting matches the same day as the  applicable
  // uses moment timezone since the day entered is in NZ time
  async getSiteTimeSettings(locationTimestamp: LocationTimestamp): Promise<any> {
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

  async getDistanceM(startLat: number, startLon: number, endLat: number, endLon: number):Promise<number> {
    const sql = `
    SELECT
        ST_Distance(
          ST_Transform(ST_SetSRID(ST_MakePoint(${startLon}, ${startLat}), 4326), 3857),
          ST_Transform(ST_SetSRID(ST_MakePoint(${endLon}, ${endLat}), 4326), 3857)
      ) AS distance_meters;
    `;
    const res:any = await this.LOCATIONEVENT_REPOSITORY.sequelize.query(sql, { raw: true });
    return Math.abs(parseFloat(res[0][0]['distance_meters']));
  }

  async createFromLocationTimestamp(loc: LocationTimestamp, previousLocs: LocationTimestamp[],
      timeSettings: any, company: Company): Promise<LocationEvent> {
    let locEvt:any = {};

    locEvt.locationTimestampId = loc.id;

    if(!previousLocs.length) {
      locEvt.eventType = getEvtTypeFromSingleLoc(loc, timeSettings, tzStr);
      const res = await this.create(locEvt);
      return res;
    }

    const evtType:string = await this.getEvtTypeFromLocGroup(loc, previousLocs, timeSettings, company, tzStr);
    locEvt.eventType = evtType;
    const res = await this.create(locEvt);
    return res;
  }

  async getEvtTypeFromLocGroup(loc: LocationTimestamp, previousLocs: LocationTimestamp[], timeSettings: any, company: any, tzStr: string):Promise<string> {
    if(isPrivacyBlocked(loc, timeSettings, tzStr)) {
      return PRIVACY_BLOCKED;
    }

    const sortedLocs = sortBy(previousLocs, a => a.locationDateTime.getTime());

    const latestLoc = sortedLocs[sortedLocs.length - 1];
    const latestEvent = latestLoc.locationEvent;
    const latestEventType = latestEvent ? latestEvent.eventType : PRIVACY_BLOCKED;

    const currentTimeUtc = momenttz.utc(loc.locationDateTime);
    const toleraceDurationSec = momenttz.duration(company.glitchRemovalPeriod).asSeconds();
    const totalTimeSec = Math.abs(momenttz.utc(sortedLocs[0].locationDateTime).diff(currentTimeUtc, 'seconds')) || 1;
    const latestTimeSec = Math.abs(momenttz.utc(latestLoc.locationDateTime).diff(currentTimeUtc, 'seconds')) || 1;

    const totalDistanceM = await this.getDistanceM(sortedLocs[0].latitude, sortedLocs[0].longitude, loc.latitude, loc.longitude);
    const latestDistanceM = await this.getDistanceM(latestLoc.latitude, latestLoc.longitude, loc.latitude, loc.longitude);

    const totalSpeedMSec = totalDistanceM > 0 ? totalDistanceM / totalTimeSec : 0;
    const latestSpeedMsec = latestDistanceM > 0 ? latestDistanceM / latestTimeSec : 0;

    const canEnterExitSpeed = totalSpeedMSec < maxEnterTotalSpeedMS && latestSpeedMsec < maxEnterSpeedMS;
    const isWithinMaxDistance = loc.closestSiteDistance < maxSiteDistance;

    const isWithinSpeedAccuracy = latestSpeedMsec < maxAccuracySpeedMS;
    const isWithinToleranceDuration = toleraceDurationSec < latestTimeSec;
    const isTooFarAway = loc.closestSiteDistance > absoluteMaXOnSiteDistanceM;

    const canExit = (!isWithinMaxDistance && canEnterExitSpeed && isWithinSpeedAccuracy);
    const canEnter = isWithinMaxDistance && canEnterExitSpeed && isWithinSpeedAccuracy;

    if ([ENTER_SITE, ON_SITE].includes(latestEventType)){
      if(canExit || isTooFarAway) {
        return EXIT_SITE;
      } else {
        return ON_SITE;
      }
    } else if([PRIVACY_BLOCKED, EXIT_SITE, OFF_SITE].includes(latestEventType)) {
      if(canEnter) {
        return ENTER_SITE;
      } else {
        return OFF_SITE;
      }
    }
  }

}

function getEvtTypeFromSingleLoc(loc: LocationTimestamp, timeSettings:any, tzStr: string) {
  if(isPrivacyBlocked(loc, timeSettings, tzStr)) {
    return PRIVACY_BLOCKED;
  }
  if(loc.closestSiteDistance < maxSiteDistance) {
    return ENTER_SITE;
  }
  return OFF_SITE;
}

export function isPrivacyBlocked(loc: LocationTimestamp, timeSettings:any, tzStr: string) {
  const { workingDayEarliestStart, workingDayLatestFinish } = timeSettings;
  const mLoctimeStr = momenttz(loc.locationDateTime).tz(tzStr).format('HH:mm');
  const isEarly = mtzFromTimeStr(mLoctimeStr).isBefore(mtzFromTimeStr(workingDayEarliestStart));
  const isLate =  mtzFromTimeStr(mLoctimeStr).isAfter(mtzFromTimeStr(workingDayLatestFinish));
  return isEarly || isLate;
}

