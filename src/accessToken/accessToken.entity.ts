
import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'accesstoken', modelName: 'accesstoken', underscored: true })
export class AccessToken extends Model<AccessToken> {

  @Column(DataType.INTEGER)
  workerId: number;

  @Column(DataType.DATE)
  creationDateTime: Date;

  @Column(DataType.STRING)
  accessTokenId: string;

}

