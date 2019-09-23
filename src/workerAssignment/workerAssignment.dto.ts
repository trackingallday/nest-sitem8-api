
import { IsString, IsInt, IsOptional, IsNumber, IsDate, IsBoolean } from 'class-validator';

export default class WorkerAssignmentDto {

  @IsNumber() readonly workerAssignmentId: number;

  @IsNumber() readonly siteAssignmentId: number;

  @IsNumber() readonly workerId: number;

  @IsNumber() readonly assignedStatus: number;

}
