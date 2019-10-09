
import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { WorkerAssignment } from '../workerAssignment/workerAssignment.entity';
import { DayOfWeekTimeSetting } from '../dayOfWeekTimeSetting/dayOfWeekTimeSetting.entity';

@Table({ tableName: 'siteassignment', modelName: 'siteassignment', underscored: true })
export class SiteAssignment extends Model<SiteAssignment> {

  @Column(DataType.INTEGER)
  siteAssignmentId: number;

  @Column(DataType.INTEGER)
  siteId: number;

  @Column(DataType.INTEGER)
  supervisingWorkerId: number;

  @Column(DataType.DATE)
  createdAt: Date;

  @Column(DataType.BOOLEAN)
  archived: boolean;

  @Column(DataType.BOOLEAN)
  canAddWorkerFromLocationTimestamp: boolean;

  @HasMany(() => WorkerAssignment)
  workerAssignments: WorkerAssignment[];

  @HasMany(() => DayOfWeekTimeSetting)
  dayOfWeekTimeSettings: DayOfWeekTimeSetting[];
}

