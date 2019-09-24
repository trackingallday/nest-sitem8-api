
import { Injectable, Inject } from '@nestjs/common';
import { SiteAssignment } from './siteAssignment.entity';
import { SiteAssignmentInterface } from './siteAssignment.interface';
import { WorkerAssignment } from '../workerAssignment/workerAssignment.entity';
import { DayOfWeekTimeSetting } from '../dayOfWeekTimeSetting/dayOfWeekTimeSetting.entity';
import WorkerAssignmentDto from './node_modules/src/workerAssignment/workerAssignment.dto';
import { WorkerAssignmentStatus } from '../common/enums';
import rawdb from '../common/rawdatabase';

@Injectable()
export class SiteAssignmentService {

  @Inject('SITEASSIGNMENT_REPOSITORY') private readonly SITEASSIGNMENT_REPOSITORY: typeof SiteAssignment;
  @Inject('DAYOFWEEKTIMESETTING_REPOSITORY') private readonly DAYOFWEEKTIMESETTING_REPOSITORY: typeof DayOfWeekTimeSetting;
  @Inject('WORKERASSIGNMENT_REPOSITORY') private readonly WORKERASSIGNMENT_REPOSITORY: typeof WorkerAssignment;

  async attachRelated(siteAssignment: SiteAssignment): Promise<any> {
    const params = { where: { siteAssignmentId: siteAssignment.id }};
    const dayOfWeekTimeSettings = await this.DAYOFWEEKTIMESETTING_REPOSITORY.findAll<DayOfWeekTimeSetting>(params).toJSON();
    const workerAssignments = await this.WORKERASSIGNMENT_REPOSITORY.findAll<WorkerAssignment>(params).toJSON();
    let jsonVal = siteAssignment.toJSON();
    return { ...jsonVal, dayOfWeekTimeSettings, workerAssignments };
  }

  async findAll(): Promise<SiteAssignment[]> {
    return await this.SITEASSIGNMENT_REPOSITORY.findAll<SiteAssignment>();
  }

  async create(props: SiteAssignmentInterface): Promise<SiteAssignment> {
    return await this.SITEASSIGNMENT_REPOSITORY.create<SiteAssignment>(props);
  }

  async findAllWhere(props): Promise<SiteAssignment[]> {
    return await this.SITEASSIGNMENT_REPOSITORY.findAll<SiteAssignment>(props);
  }

  async findOneWhere(props): Promise<SiteAssignment> {
    return await this.SITEASSIGNMENT_REPOSITORY.findOne<SiteAssignment>(props);
  }

  async findById(id): Promise<SiteAssignment> {
    return await this.SITEASSIGNMENT_REPOSITORY.findByPk<SiteAssignment>(id);
  }

  async getBlockedSiteIdsByWorkerId(workerId: number): Promise<any[]> {
    const sql = `
      SELECT SiteId
      FROM WorkerAssignment wa join SiteAssignment sa
        ON wa.siteAssignmentId = sa.siteAssignmentId
      WHERE wa.WorkerId = ${workerId} and sa.archived = 0
        and not wa.assignedStatus = 0;
    `;
    return await rawdb.query(sql, { raw: true });
  }

}

