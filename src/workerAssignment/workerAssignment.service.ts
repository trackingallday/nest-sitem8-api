
import { Injectable, Inject } from '@nestjs/common';
import { WorkerAssignment } from './workerAssignment.entity';
import { WorkerAssignmentInterface } from './workerAssignment.interface';
import constants from '../constants'

@Injectable()
export class WorkerAssignmentService {

  @Inject('WORKERASSIGNMENT_REPOSITORY') private readonly WORKERASSIGNMENT_REPOSITORY: typeof WorkerAssignment;

  async findAll(): Promise<WorkerAssignment[]> {
    return await this.WORKERASSIGNMENT_REPOSITORY.findAll<WorkerAssignment>();
  }

  async create(props: WorkerAssignmentInterface): Promise<WorkerAssignment> {
    return await this.WORKERASSIGNMENT_REPOSITORY.create<WorkerAssignment>(props);
  }

  async findAllWhere(props): Promise<WorkerAssignment[]> {
    return await this.WORKERASSIGNMENT_REPOSITORY.findAll<WorkerAssignment>(props);
  }

  async findOneWhere(props): Promise<WorkerAssignment> {
    return await this.WORKERASSIGNMENT_REPOSITORY.findOne<WorkerAssignment>(props);
  }

  async findById(id): Promise<WorkerAssignment> {
    return await this.WORKERASSIGNMENT_REPOSITORY.findByPk<WorkerAssignment>(id);
  }

}

