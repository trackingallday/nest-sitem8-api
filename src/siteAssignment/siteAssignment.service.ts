import { Op } from 'sequelize';
import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { SiteAssignment } from './siteAssignment.entity';
import { SiteAssignmentInterface, AddSiteAssignmentParams } from './siteAssignment.interface';
import { WorkerAssignment } from '../workerAssignment/workerAssignment.entity';
import { DayOfWeekTimeSetting } from '../dayOfWeekTimeSetting/dayOfWeekTimeSetting.entity';
import { Worker } from '../worker/worker.entity';
import { Site } from '../site/site.entity';

@Injectable()
export class SiteAssignmentService {

  @Inject('SITEASSIGNMENT_REPOSITORY') private readonly SITEASSIGNMENT_REPOSITORY: typeof SiteAssignment;

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

  async findSiteAssignmentWithChilds(id) {
    return await this.SITEASSIGNMENT_REPOSITORY.findOne<SiteAssignment>(
      {
        where: {
          id,
        },
        include: [{
          model: WorkerAssignment,
          required: false,
          as: 'workerAssignments',
          include: [
            {
              model: Worker,
              required: false,
              as: 'worker',
            },
          ],
        },
        {
          model: DayOfWeekTimeSetting,
          required: false,
          as: 'dayOfWeekTimeSettings',
        }],
      },
      );
  }

  async getBlockedSiteIdsByWorkerId(workerId: number): Promise<any[]> {
    const sql = `
    SELECT sa.site_id
    FROM workerassignment wa join siteassignment sa
      ON wa.site_assignment_id = sa.id
    WHERE wa.worker_id = ${workerId}
      and sa.archived = false
      and (not wa.assigned_status = 1
      or (wa.assigned_status = 0 or sa.can_add_worker_from_location_timestamp = false))
    `;
    const res = await this.SITEASSIGNMENT_REPOSITORY.sequelize.query(sql, { raw: true });
    return res[0];
  }

  async validateSiteAssignment(workerAssignments: WorkerAssignment[], siteAssignment: SiteAssignment, companyId: number): Promise<void> {
    const workers: Worker[] = workerAssignments.map(m => m.worker);
    if (workers.some(x => x.companyId !== companyId) || siteAssignment.site.companyId !== companyId) {
      throw new HttpException('Illegal site assignment', HttpStatus.BAD_REQUEST);
    }
  }

  async addSiteAssignment(params: AddSiteAssignmentParams): Promise<SiteAssignment> {
    return this.SITEASSIGNMENT_REPOSITORY.sequelize.transaction(async t => {
      // Archieving old assignments
      await this.SITEASSIGNMENT_REPOSITORY.update(
        {
          archived: true,
          endDate: new Date(),
        },
        {
          where: {
            siteId: params.siteAssignment.siteId,
            archived: false,
          },
          transaction: t,
        });
      // create new assignments
      params.siteAssignment.createdAt = new Date();
      params.siteAssignment.startDate = new Date();
      params.siteAssignment.workerAssignments = params.workerAssignments;
      params.siteAssignment.dayOfWeekTimeSettings = params.dayOfWeekSettings;
      return await this.SITEASSIGNMENT_REPOSITORY.create<SiteAssignment>(params.siteAssignment, {
        include: [WorkerAssignment, DayOfWeekTimeSetting],
        transaction: t,
      });
    }).catch(error => {
      throw new HttpException(error, HttpStatus.NOT_MODIFIED);
    });
  }

  async getActiveSiteAssignments(activeSites: Site[]): Promise<SiteAssignment[]> {
    const siteIds = activeSites.map(m => m.siteId);
    return await this.findAllWhere(
      {
        archived: false,
        siteId: {
          [Op.or]: siteIds,
        },
  });
  }

  async getActiveSiteAssignment(activeSites: Site): Promise<SiteAssignment> {
    return await this.findOneWhere(
      {
        archived: false,
        siteId: activeSites.siteId,
  });
  }

}
