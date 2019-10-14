
import { Get, Post, Body, Param, Controller, UsePipes, Req  } from '@nestjs/common';
import { WorkerService } from './worker.service';
import WorkerDto from './worker.dto';
import Auth0Gateway from '../common/auth0.gateway';
import { ValidationPipe } from '../common/validation.pipe';

@Controller('workers')
export class WorkerController {

  constructor(private readonly workerService: WorkerService) {}

  @Get()
  async findAll(@Req() req) {
    const all = await this.workerService.findAllWhere({ where: { companyId: req.dbUser.companyId }});
    return all;
  }

  @Get('/:id')
  async findById(@Req() req, @Param() id: number) {
    const worker = await this.workerService.findById(id);
    return worker;
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Req() req, @Body() worker: WorkerDto) {
    const user = await this.workerService.create(
      { ...worker, companyId: req.dbUser.companyId });
    const data = await new Auth0Gateway().createUser(user.email);
    const res = await this.workerService.updateOne(user.id, { authId: data.user_id });
    return res;
  }

  @Post('/:id')
  @UsePipes(new ValidationPipe())
  async update(@Req() req, @Param() id: number, @Body() worker: WorkerDto) {
    const thisWorker = await this.workerService.findById(id);
    await thisWorker.update(worker);
    return thisWorker;
  }

  @Get('/getenabledsupervisors')
  async getEnabledSupervisors(@Req() req) {
    const companyId = req.dbUser.companyId;
    const res = await this.workerService.getEnabledSupervisors(companyId);
    return res;
  }

  @Get('switchcompany/:id')
  @UsePipes(new ValidationPipe())
  async switchCompany(@Req() req, @Param() id: number) {
    await this.workerService.switchCompany(req.dbUser.id, id);
    return true;
  }
}
