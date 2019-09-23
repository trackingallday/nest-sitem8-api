
import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class LocationTimestamp extends Model<LocationTimestamp> {

  @Column(DataType.INTEGER)
  locationTimestampId: number;

  @Column(DataType.STRING)
  deviceId: string;

  @Column(DataType.INTEGER)
  workerId: number;

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

  @Column(DataType.INTEGER)
  signalStrength: number;

  @Column(DataType.FLOAT)
  altitude: number;

  @Column(DataType.INTEGER)
  companyId: number;

  @Column(DataType.GEOMETRY)
  geom: any;

}

