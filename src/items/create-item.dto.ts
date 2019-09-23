import { IsString, IsInt, IsOptional, IsNumber, IsDate, IsBoolean } from 'class-validator';

export default class CreateItemDto {
  @IsString() readonly name: string;
  @IsOptional() readonly geometry: any;
  @IsOptional() readonly companyId: number;
  @IsInt() readonly price: number;
}
