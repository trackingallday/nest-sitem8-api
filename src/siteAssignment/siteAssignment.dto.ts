
import { IsString, IsInt, IsOptional, IsNumber, IsDate, IsBoolean } from 'class-validator';

export default class SiteAssignmentDto {

  @IsNumber() readonly siteAssignmentId: number;

  @IsNumber() readonly siteId: number;

  @IsNumber() readonly supervisingWorkerId: number;

  @IsDate() readonly createdAt: Date;

  @IsBoolean() readonly archived: boolean;

  @IsBoolean() readonly canAddWorkerFromLocationTimestamp: boolean;

}
