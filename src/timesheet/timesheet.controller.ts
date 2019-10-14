
import { Get, Post, Body, Param, Controller, UsePipes, Req } from '@nestjs/common';
import { TimesheetService } from './timesheet.service';
import { AccessTokenService } from '../accessToken/accessToken.service';
import { WorkerService } from '../worker/worker.service';
import { SiteService } from '../site/site.service';
import { Timesheet } from './timesheet.entity';
import TimesheetDto from './timesheet.dto';
import { ValidationPipe } from '../common/validation.pipe';
import { Worker } from '../worker/worker.entity';

@Controller('timesheet')
export class TimesheetController {

  constructor(private readonly timesheetService: TimesheetService,
              private readonly accesstokenService: AccessTokenService,
              private readonly workerService: WorkerService,
              private readonly siteService: SiteService,
  ) { }

  @Get()
  async findAll(): Promise<Timesheet[]> {
    return this.timesheetService.findAll();
  }

  // @Get('/:id')
  // async findById(@Param() params): Promise<Timesheet> {
  //   return this.timesheetService.findById(parseInt(params.id));
  // }

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() timesheet: TimesheetDto) {
    this.timesheetService.create(timesheet);
  }

  // @Post('/:id')
  // @UsePipes(new ValidationPipe())
  // async update(@Param() id: number, @Body() timesheet: TimesheetDto) {
  //   const thisTimesheet = await this.timesheetService.findById(id);
  //   thisTimesheet.set(timesheet);
  //   await thisTimesheet.save();
  //   return thisTimesheet;
  // }

  @Get('mytimesheet/data/:company/:token')
  async myTimesheet(@Param() params): Promise<any> {
    const worker: Worker = await this.accesstokenService.getWorkerFromAccessToken(params.token);
    const companyId: number = worker.companyId;
    const retvals = {
      worker: await this.workerService.getWorkersByCompany(companyId, false),
      sites: await this.siteService.findAllWhere({ companyId }),
    };
    return retvals;
  }

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
    return await this.timesheetService.getUnlockedTimesheets(companyId);
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
  async getMyDistinctTimesheets(@Param() token: string, @Param() companyId: number) {
    const worker: Worker = await this.accesstokenService.getWorkerFromAccessToken(token);
    return await this.timesheetService.getDistinctTimesheets(companyId, worker.workerId);
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
