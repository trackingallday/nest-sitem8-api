
import { IsString, IsNumber } from 'class-validator';

export default class LocationTimestampDto {

  @IsString() readonly eventType: string;

  @IsNumber() readonly locationTimestampId: number;

}
