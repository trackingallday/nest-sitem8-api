
import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { SiteAssignment } from '../siteAssignment/siteAssignment.entity';
import { Worker } from '../worker/worker.entity';

@Table({ tableName: 'workerassignment', modelName: 'workerassignment', underscored: true })
export class WorkerAssignment extends Model<WorkerAssignment> {

  @Column(DataType.INTEGER)
  workerAssignmentId: number;

  @ForeignKey(() => SiteAssignment)
  @Column(DataType.INTEGER)
  siteAssignmentId: number;

  @Column(DataType.INTEGER)
  assignedStatus: number;

  @BelongsTo(() => SiteAssignment)
  siteAssignment: SiteAssignment;

  @ForeignKey(() => Worker)
  @Column(DataType.INTEGER)
  workerId: number;

  @BelongsTo(() => Worker)
  worker: Worker;
}
