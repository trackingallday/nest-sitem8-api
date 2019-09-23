
import { IsString, IsInt, IsOptional, IsNumber, IsDate, IsBoolean } from 'class-validator';

export default class LocationTimestampDto {

  @IsNumber() readonly locationTimestampId: number;

  @IsString() readonly deviceId: string;

  @IsNumber() readonly workerId: number;

  @IsDate() readonly creationDateTime: Date;

  @IsNumber() readonly latitude: number;

  @IsNumber() readonly longitude: number;

  @IsNumber() readonly battery: number;

  @IsNumber() readonly closestSiteId: number;

  @IsNumber() readonly closestSiteDistance: number;

  @IsDate() readonly locationDateTime: Date;

  @IsString() readonly rawData: string;

  @IsBoolean() readonly charging: boolean;

  @IsBoolean() readonly sosButton: boolean;

  @IsNumber() readonly signalStrength: number;

  @IsNumber() readonly altitude: number;

  @IsNumber() readonly companyId: number;

  @IsOptional() readonly geom: any;

}
