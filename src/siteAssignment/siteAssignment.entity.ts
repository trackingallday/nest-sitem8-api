
import { Table, Column, Model, DataType, HasMany, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { WorkerAssignment } from '../workerAssignment/workerAssignment.entity';
import { DayOfWeekTimeSetting } from '../dayOfWeekTimeSetting/dayOfWeekTimeSetting.entity';
import { Site } from '../site/site.entity';

@Table({ tableName: 'siteassignment', modelName: 'siteassignment', underscored: true })
export class SiteAssignment extends Model<SiteAssignment> {

  @Column(DataType.INTEGER)
  siteAssignmentId: number;

  @Column(DataType.INTEGER)
  supervisingWorkerId: number;

  @Column(DataType.DATE)
  createdAt: Date;

  @Column(DataType.BOOLEAN)
  archived: boolean;

  @Column(DataType.BOOLEAN)
  canAddWorkerFromLocationTimestamp: boolean;

  @Column(DataType.DATE)
  startDate: Date;

  @Column(DataType.DATE)
  endDate: Date;

  @HasMany(() => WorkerAssignment)
  workerAssignments: WorkerAssignment[];

  @HasMany(() => DayOfWeekTimeSetting)
  dayOfWeekTimeSettings: DayOfWeekTimeSetting[];

  @ForeignKey(() => Site)
  @Column(DataType.INTEGER)
  siteId: number;

  @BelongsTo(() => Site)
  site: Site;
}
