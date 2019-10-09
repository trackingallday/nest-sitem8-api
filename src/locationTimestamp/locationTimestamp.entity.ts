
import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasOne } from 'sequelize-typescript';
import { Worker } from '../worker/worker.entity';
import { Device } from '../device/device.entity';
import { LocationEvent } from '../locationEvent/locationEvent.entity';


@Table({ tableName: 'locationtimestamp', modelName: 'locationtimestamp', underscored: true })
export class LocationTimestamp extends Model<LocationTimestamp> {

  @ForeignKey(() => Device)
  @Column(DataType.STRING)
  deviceId: string;

  @BelongsTo(() => Worker)
  device: Device;

  @ForeignKey(() => Worker)
  @Column(DataType.INTEGER)
  workerId: number;

  @BelongsTo(() => Worker)
  worker: Worker;

  @HasOne(() => LocationEvent)
  locationEvent: LocationEvent;

  @Column(DataType.DATE)
  creationDateTime: Date;

  @Column(DataType.FLOAT)
  latitude: number;

  @Column(DataType.FLOAT)
  longitude: number;

  @Column(DataType.INTEGER)
  battery: number;

  @Column(DataType.INTEGER)
  closestSiteId: number;

  @Column(DataType.DECIMAL)
  closestSiteDistance: number;

  @Column(DataType.DATE)
  locationDateTime: Date;

  @Column(DataType.STRING)
  rawData: string;

  @Column(DataType.BOOLEAN)
  charging: boolean;

  @Column(DataType.BOOLEAN)
  sosButton: boolean;

  @Column(DataType.FLOAT)
  altitude: number;

  @Column(DataType.INTEGER)
  companyId: number;

  @Column(DataType.GEOMETRY)
  geom: any;

}

