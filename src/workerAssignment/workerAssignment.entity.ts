
import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { SiteAssignment } from '../siteAssignment/siteAssignment.entity';


@Table({ tableName: 'workerassignment', modelName: 'workerassignment', underscored: true })
export class WorkerAssignment extends Model<WorkerAssignment> {

  @Column(DataType.INTEGER)
  workerAssignmentId: number;

  @ForeignKey(() => SiteAssignment)
  @Column(DataType.INTEGER)
  siteAssignmentId: number;

  @Column(DataType.INTEGER)
  workerId: number;

  @Column(DataType.INTEGER)
  assignedStatus: number;

  @BelongsTo(() => SiteAssignment, 'siteAssignmentId')
  siteAssignment: SiteAssignment;

}

