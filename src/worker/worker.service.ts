
import { Injectable, Inject } from '@nestjs/common';
import { Op } from 'sequelize';
import { Worker } from './worker.entity';
import { Company } from '../company/company.entity';
import { WorkerInterface } from './worker.interface';


@Injectable()
export class WorkerService {

  @Inject('WORKER_REPOSITORY') private readonly WORKER_REPOSITORY: typeof Worker;

  async findAll(): Promise<Worker[]> {
    return await this.WORKER_REPOSITORY.findAll<Worker>();
  }

  // AddWorker
  async create(props: WorkerInterface): Promise<Worker> {
    return await this.WORKER_REPOSITORY.create<Worker>(props);
  }

  // GetAllUsersAllCompanies //GetEnabledSupervisors
  async findAllWhere(props): Promise<Worker[]> {
    return await this.WORKER_REPOSITORY.findAll<Worker>(props);
  }

  async findOneWhere(props): Promise<Worker> {
    return await this.WORKER_REPOSITORY.findOne<Worker>(props);
  }

  // GetWorker GetWorkerAnyCompany
  async findById(id): Promise<Worker> {
    return await this.WORKER_REPOSITORY.findByPk<Worker>(id, { include: [Company] });
  }

  async updateOne(id: number, props: any): Promise<Worker> {
    const worker = await this.findById(id);
    await worker.update(props);
    return worker;
  }

  async updateWorker(id: number, props: any): Promise<Worker> {
    return this.updateOne(id, props);
  }

  async getEnabledSupervisors(companyId: number): Promise<Worker[]> {
    const params = {
      where: {
        isEnabled: true,
        isSupervisor: true,
        companyId,
      },
    };
    return await this.findAllWhere(params);
  }

  async getWorkerByDeviceId(deviceId: number): Promise<Worker> {
    return await this.findOneWhere({ deviceId });
  }

  async getWorkerByCompanyIdAndWorkerId(companyId: number, workerId: number): Promise<Worker> {
    return await this.findOneWhere({ companyId, workerId });
  }

  // GetAllUsers
  async getWorkersByCompany(companyId: number, isAdmin: boolean): Promise<Worker[]> {
    const workers = isAdmin ? await this.findAllWhere({ where: { companyId } }) :
      await this.findAllWhere({ where: { companyId }, attributes: ['workerId', 'name'] });

    return workers;
  }

  async switchCompany(workerId: number, companyId: number): Promise<Worker> {
    return await this.updateWorker(workerId, { companyId });
  }

  async getWorkerByAuthId(authId: string): Promise<Worker> {
    return await this.findOneWhere({ where: { authId }});
  }

  async findManyByIds(ids: number[]): Promise<Worker[]> {
    return await this.findAllWhere({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
    });
  }

  async validateWorkerCompanyIds(ids: number[], companyId: number): Promise<Boolean> {
    const workers = await this.findManyByIds(ids);
    return !workers.some(w => w.companyId !== companyId);
  }

}
