
import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'workerassignment', modelName: 'workerassignment', underscored: true })
export class WorkerAssignment extends Model<WorkerAssignment> {

  @Column(DataType.INTEGER)
  workerAssignmentId: number;

  @Column(DataType.INTEGER)
  siteAssignmentId: number;

  @Column(DataType.INTEGER)
  workerId: number;

  @Column(DataType.INTEGER)
  assignedStatus: number;

}

