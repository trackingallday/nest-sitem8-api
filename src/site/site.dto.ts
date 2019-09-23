
import { IsString, IsInt, IsOptional, IsNumber, IsDate, IsBoolean } from 'class-validator';

export default class SiteDto {

  @IsNumber() readonly siteId: number;

  @IsString() readonly name: string;

  @IsOptional() readonly geom: any;

  @IsBoolean() readonly active: boolean;

  @IsNumber() readonly companyId: number;

  @IsString() readonly sitePayrollId: string;

}
