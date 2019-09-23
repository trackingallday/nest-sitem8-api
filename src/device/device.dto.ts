
import { IsString, IsInt, IsOptional, IsNumber, IsDate, IsBoolean } from 'class-validator';

export default class DeviceDto {

  @IsString() readonly deviceId: string;

  @IsNumber() readonly companyId: number;

}
