
import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class AccessToken extends Model<AccessToken> {

  @Column(DataType.INTEGER)
  workerId: number;
  
  @Column(DataType.DATE)
  creationDateTime: Date;
  
  @Column(DataType.STRING)
  accessTokenId: string;
  
}

