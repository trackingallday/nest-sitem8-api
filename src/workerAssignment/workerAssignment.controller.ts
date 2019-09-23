
import { Get, Post, Body, Param, Controller, UsePipes  } from '@nestjs/common';
import { WorkerAssignmentService } from './workerAssignment.service';
import { WorkerAssignment } from './workerAssignment.entity';
import WorkerAssignmentDto from './workerAssignment.dto';
import { ValidationPipe } from '../common/validation.pipe';


@Controller('workerAssignment')
export class WorkerAssignmentController {

  constructor(private readonly workerAssignmentService: WorkerAssignmentService) {}

  @Get()
  async findAll(): Promise<WorkerAssignment[]> {
    return this.workerAssignmentService.findAll();
  }

  @Get('/:id')
  async findById(@Param() params): Promise<WorkerAssignment> {
    return this.workerAssignmentService.findById(parseInt(params.id));
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() workerAssignment: WorkerAssignmentDto) {
    this.workerAssignmentService.create(workerAssignment);
  }

  @Post('/:id')
  @UsePipes(new ValidationPipe())
  async update(@Param() id: number, @Body() workerAssignment: WorkerAssignmentDto) {
    const thisWorkerAssignment = await this.workerAssignmentService.findById(id);
    thisWorkerAssignment.set(workerAssignment);
    await thisWorkerAssignment.save();
    return thisWorkerAssignment;
  }
}

