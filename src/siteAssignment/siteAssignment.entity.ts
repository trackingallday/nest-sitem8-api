
import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
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

  workerAssignments: any;
  dayOfWeekTimeSettings: any;
}

