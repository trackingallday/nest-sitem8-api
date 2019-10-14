
import { IsString, IsInt, IsOptional, IsNumber, IsDate, IsBoolean } from 'class-validator';

export class CreateCompanyDto {
  @IsString() readonly companyName: string;
  @IsString() readonly name: string;
  @IsString() readonly mobile: string;
  @IsString() readonly email: string;
}
