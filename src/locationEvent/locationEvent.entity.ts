
import { Table, Column, Model, DataType, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { LocationTimestamp } from '../locationTimestamp/locationTimestamp.entity'
import { eventTypeEnum } from './constants';

const { ENTER_SITE, EXIT_SITE, ON_SITE, OFF_SITE, PRIVACY_BLOCKED } = eventTypeEnum;

@Table({ tableName: 'locationevent', modelName: 'locationevent', underscored: true })
export class LocationEvent extends Model<LocationEvent> {

  @Column(DataType.ENUM(ENTER_SITE, EXIT_SITE, ON_SITE, OFF_SITE, PRIVACY_BLOCKED))
  eventType: string;

  @ForeignKey(() => LocationTimestamp)
  @Column(DataType.INTEGER)
  locationTimestampId: number;

  @BelongsTo(() => LocationTimestamp, 'locationTimestampId')
  locationTimestamp: LocationTimestamp;

}
