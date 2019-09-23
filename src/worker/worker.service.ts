
import { Injectable, Inject } from '@nestjs/common';
import { Worker } from './worker.entity';
import { WorkerInterface } from './worker.interface';
import constants from '../constants'

@Injectable()
export class WorkerService {

  @Inject('WORKER_REPOSITORY') private readonly WORKER_REPOSITORY: typeof Worker;

  async findAll(): Promise<Worker[]> {
    return await this.WORKER_REPOSITORY.findAll<Worker>();
  }

  //AddWorker
  async create(props: WorkerInterface): Promise<Worker> {
    return await this.WORKER_REPOSITORY.create<Worker>(props);
  }

  //GetAllUsersAllCompanies
  async findAllWhere(props): Promise<Worker[]> {
    return await this.WORKER_REPOSITORY.findAll<Worker>(props);
  }

  async findOneWhere(props): Promise<Worker> {
    return await this.WORKER_REPOSITORY.findOne<Worker>(props);
  }

  //GetWorker GetWorkerAnyCompany
  async findById(id): Promise<Worker> {
    return await this.WORKER_REPOSITORY.findByPk<Worker>(id);
  }

  async updateWorker(id: number, workerProps: any): Promise<Worker> {
    const worker = await this.findById(workerProps);
    worker.set(workerProps);
    await worker.save();
    return worker;
  }

  async getEnabledSupervisors(companyId: number): Promise<Worker[]> {
    return await this.findAllWhere(
      { isEnabled: true, isSupervisor: true, companyId });
  }

  async getWorkerByDeviceId(deviceId: number): Promise<Worker> {
    return await this.findOneWhere({ deviceId });
  }

  //GetAllUsers
  async getWorkersByCompany(companyId: number): Promise<Worker[]> {
    return await this.findAllWhere({ companyId });
  }

  async switchCompany(workerId: number, companyId: number): Promise<Worker> {
    return await this.updateWorker(workerId, { companyId });
  }

  async getWorkerByAuthId(authId: string): Promise<Worker> {
    return await this.findOneWhere({ authId });
  }

}


