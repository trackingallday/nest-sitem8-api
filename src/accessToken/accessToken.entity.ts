
import { Table, Column, Model, DataType, BelongsTo } from 'sequelize-typescript';
import { Worker } from '../worker/worker.entity';

@Table({ tableName: 'accesstoken', modelName: 'accesstoken', underscored: true })
export class AccessToken extends Model<AccessToken> {

  @Column(DataType.DATE)
  creationDateTime: Date;

  @Column(DataType.STRING)
  accessTokenId: string;

  @Column(DataType.INTEGER)
  workerId: number;

  @BelongsTo(() => Worker, 'workerId')
  worker: Worker;
}
