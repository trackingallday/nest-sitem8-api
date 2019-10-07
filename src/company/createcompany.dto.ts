
import { IsString, IsInt, IsOptional, IsNumber, IsDate, IsBoolean } from 'class-validator';

export class CreateCompanyParams {
  @IsString() readonly companyName: string;
  @IsString() readonly name: string;
  @IsString() readonly mobile: string;
  @IsString() readonly email: string;
}
