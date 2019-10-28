
import { Get, Post, Body, Param, Controller, UsePipes, Req, HttpException, HttpStatus  } from '@nestjs/common';
import { TimesheetService } from './timesheet.service';
import { AccessTokenService } from '../accessToken/accessToken.service';
import { WorkerService } from '../worker/worker.service';
import { LocationTimestampService } from '../locationTimestamp/locationTimestamp.service';
import { TimesheetEntryService } from '../timesheetEntry/timesheetEntry.service';
import { SiteService } from '../site/site.service';
import { Timesheet } from './timesheet.entity';
import { LocationEvent } from '../locationEvent/locationEvent.entity';
import { TimesheetEntry } from '../timesheetEntry/timesheetEntry.entity';
import { TimesheetDto } from './timesheet.dto';
import { TimesheetEntryDto } from '../timesheetEntry/timesheetEntry.dto';
import { ValidationPipe } from '../common/validation.pipe';
import * as momenttz from 'moment-timezone';
import { isEmpty } from 'lodash';


/* combining the timesheet entries endpoints and the timesheet endpoints as they are totally related and dependent */


@Controller('timesheet')
export class TimesheetController {

  constructor(private readonly timesheetService: TimesheetService,
              private readonly workerService: WorkerService,
              private readonly siteService: SiteService,
              private readonly timesheetEntryService: TimesheetEntryService,
              private readonly locationTimestampService: LocationTimestampService,
  ) { }

    //req is any because we customise that
  async validateWorkerIds(req:any, workerIds: number[]) {
    const validWorkers = await this.workerService.validateWorkerCompanyIds(
      workerIds, req.dbUser.companyId);
    if(!validWorkers) {
      throw new HttpException('Illegal access', HttpStatus.FORBIDDEN);
    }
  }

  //timesheet must include the worker
  async validateTimesheet(req:any, ts: Timesheet) {
    if(ts.worker.companyId !== req.dbUser.companyId) {
      throw new HttpException('Illegal access', HttpStatus.FORBIDDEN);
    }
  }

  @Get('timesheet/')
  async findAll(): Promise<Timesheet[]> {
    return this.timesheetService.findAll();
  }

  @Post('createtimesheet')
  async create(@Req() req:any, @Body() timesheet: TimesheetDto): Promise<Timesheet> {
    await this.validateWorkerIds(req, [timesheet.workerId]);
    return await this.timesheetService.create(timesheet);
  }

  @Get('mytimesheet/data/:token')
  async myTimesheet(@Req() req): Promise<any> {
    const companyId: number = req.dbUser.companyId;
    const retvals = {
      worker: await this.workerService.getWorkersByCompany(companyId, false),
      sites: await this.siteService.findAllWhere({ companyId }),
    };
    return retvals;
  }

  @Post('savemanyentries/:timesheetId')
  @UsePipes(new ValidationPipe())
  async savemanyentries(@Req() req, @Param() timesheetId: number, @Body() timesheetEntrys: TimesheetEntryDto[]) {
    const ts = await this.timesheetService.findById(timesheetId);
    await this.validateWorkerIds(req, [ts.workerId]);
    if(timesheetEntrys.find(tse => !!(tse.id || tse.timesheetId))) {
      throw new HttpException('existing timesheet ids cant be saved again', HttpStatus.BAD_REQUEST);
    }
    return await this.timesheetEntryService.createMany(timesheetEntrys.map(t => ({ ...t, timesheetId })));
  }

  @Post('updateoneentry')
  @UsePipes(new ValidationPipe())
  async update(@Req() req, @Body() timesheetEntry: TimesheetEntryDto) {
    const tse = await this.timesheetEntryService.findById(timesheetEntry.id);
    await this.validateWorkerIds(req, [tse.timesheet.workerId]);
    return await this.timesheetEntryService.update(timesheetEntry);
  }

  @Get('timesheetentries/:timesheetId')
  async getTimesheetEntries(@Req() req:any, @Param() timesheetId: number): Promise<TimesheetEntry[]> {
    const ts = await this.timesheetService.findByIdWithWorkerAndEntries(timesheetId);
    this.validateTimesheet(req, ts);
    return ts.timesheetEntrys;
  }

  @Post('timesheetentriesbydaterange/:workerId')
  async getTimesheetEntriesByDateRange(@Req() req:any, @Param() workerId: number, @Body() dateRange: any): Promise<TimesheetEntry[]> {
    await this.validateWorkerIds(req, [workerId]);
    const tses = await this.timesheetEntryService.getEntriesBetween(dateRange.startDate, dateRange.endDate, workerId);
    const locationStartDate = isEmpty(tses) ? dateRange.startDate : tses[tses.length - 1].finishDateTime;
    const worker = await this.workerService.findById(workerId);
    const locs = await this.locationTimestampService.findByWorkerIdDateRange(locationStartDate, dateRange.endDate, workerId);
    const locEvts:LocationEvent[] = locs.map(l => {
      const le = l.locationEvent;
      le.locationTimestamp = l;
      return le;
    });
    const generatedEntries = this.timesheetEntryService.generateTimesheetEntries(locEvts, worker.company, 'Pacific/Auckland');
    const entries =  [...tses, ...generatedEntries];
    entries.sort((a, b) => {
      return momenttz(a.startDateTime).isBefore(momenttz(b.startDateTime)) ? -1 : 1;
    });
    return entries;
  }

  /*@Get('mytimesheet/timesheetentries/:token/:id')
  async getTimesheetEntries(@Param() params): Promise<TimesheetEntry[]> {
    return await this.timesheetEntryService.getTimesheetEntriesByTimesheetIdForCompany(params.id, params.companyId);
  }*/

  /*@Post('updatetimesheetentries')
  @UsePipes(new ValidationPipe())
  async updateTimesheetEntries(@Req() req, @Body() timesheetEntries: TimesheetEntryDto[], @Body() timesheetId: number) {
    this.timesheetEntryService.overwriteTimesheetEntries(timesheetEntries, timesheetId, req.dbUser.name, req.dbUser.workerId);
  }*/

  @Get('approvalsdata/:companyId')
  async getApprovalsData(@Param() companyId: number): Promise<any> {
    const retvals = {
      worker: await this.workerService.getWorkersByCompany(companyId, true),
      sites: await this.siteService.findAllWhere({ companyId }),
    };
    return retvals;
  }

  @Get('unlockedtimesheets')
  async getUnlockedTimesheets(companyId: number): Promise<Timesheet[]> {
    //return await this.timesheetService.getUnlockedTimesheets(companyId);
  }

  @Post('settimesheetstatus')
  async setTimesheetStatus(@Body() statusParams: any) {
    return await this.timesheetService.setTimesheetStatus(statusParams.id, statusParams.status, statusParams.companyId);
  }

  // Reportcontroller
  @Get('getapprovedtimesheetcount/')
  async getApprovedTimesheetCount(@Body() params) {
    return await this.timesheetService.countTimesheetsWithStatus(params.timesheetId, params.timesheetStatus, params.companyId);
  }

  @Get('distincttimesheets/')
  async getDistinctTimesheets(@Body() params) {
    return await this.timesheetService.getDistinctTimesheets(params.companyId, null);
  }

  @Get('mydistincttimesheets/:token/:companyId')
  async getMyDistinctTimesheets(@Req() req, @Param() token: string, @Param() companyId: number) {
    return await this.timesheetService.getDistinctTimesheets(companyId, req.dbUser.workerId);
  }

  @Get('timesheetexport/:id/:format')
  async getTimesheetReport(@Param() id: number, @Param() TimesheetFormat: number) {
   // todo
  }

  @Post('devicereport')
  async getDeviceReport(@Body() reportParams: { reportDate: Date, workerId: number}) {
   // todo
  }

  @Get('timesheetexport/:id/:format')
  async exportTimesheet(@Param() id: number, @Param() TimesheetFormat: number) {
   // todo
  }

  @Get('locktimesheets/:id')
  async lockTimesheets(@Param() id: number, @Param() companyId: number) {
    return await this.timesheetService.LockTimesheets([id], companyId);
  }
}
