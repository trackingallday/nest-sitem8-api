
import { IsString, IsInt, IsOptional, IsNumber, IsDate, IsBoolean } from 'class-validator';

export default class LocationTimestampDto {

  @IsString() readonly deviceId: string;

  @IsOptional() readonly workerId: number;

  @IsOptional() readonly creationDateTime: Date;

  @IsNumber() readonly latitude: number;

  @IsNumber() readonly longitude: number;

  @IsNumber() readonly battery: number;

  @IsOptional() readonly closestSiteId: number;

  @IsOptional() readonly closestSiteDistance: number;

  @IsDate() readonly locationDateTime: Date;

  @IsString() readonly rawData: string;

  @IsBoolean() readonly charging: boolean;

  @IsBoolean() readonly sosButton: boolean;

  @IsNumber() readonly altitude: number;

  @IsOptional() readonly companyId: number;

  @IsOptional() readonly geom: any;

}
