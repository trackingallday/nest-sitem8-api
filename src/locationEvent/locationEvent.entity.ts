
import { Table, Column, Model, DataType, BelongsTo } from 'sequelize-typescript';
import { LocationTimestamp } from '../locationTimestamp/locationTimestamp.entity'

@Table({ tableName: 'locationevent', modelName: 'locationevent', underscored: true })
export class LocationEvent extends Model<LocationEvent> {

  @Column(DataType.ENUM('enter_site', 'exit_site', 'on_site', 'off_site'))
  eventType: string;

  @Column(DataType.INTEGER)
  locationTimestampId: number;

  @BelongsTo(() => LocationTimestamp, 'locationTimestampId')
  locationTimestamp: LocationTimestamp;

}
