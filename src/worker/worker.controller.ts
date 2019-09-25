
import { Get, Post, Body, Param, Controller, UsePipes, Req  } from '@nestjs/common';
import { Request } from 'express';
import { WorkerService } from './worker.service';
import { Worker } from './worker.entity';
import WorkerDto from './worker.dto';
import { ValidationPipe } from '../common/validation.pipe';

@Controller('workers')
export class WorkerController {

  constructor(private readonly workerService: WorkerService) {}

  @Get()
  async findAll(@Req() req): Promise<Worker[]> {
    console.log(req.user, '******************************');
    return this.workerService.findAllWhere({ where: { companyId: req.dbUser.companyId }});
  }

  @Get('/:id')
  async findById(@Param() params): Promise<Worker> {
    const worker = this.workerService.findById(parseInt(params.id));
    return worker;
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() worker: WorkerDto) {
    this.workerService.create(worker);
  }

  @Post('/:id')
  @UsePipes(new ValidationPipe())
  async update(@Param() id: number, @Body() worker: WorkerDto) {
    const thisWorker = await this.workerService.findById(id);
    thisWorker.set(worker);
    await thisWorker.save();
    return thisWorker;
  }
}
