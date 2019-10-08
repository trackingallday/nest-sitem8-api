
import { IsString, IsNumber } from 'class-validator';

export class LocationEventDto {

  @IsString() readonly eventType: string;

  @IsNumber() readonly locationTimestampId: number;

}
