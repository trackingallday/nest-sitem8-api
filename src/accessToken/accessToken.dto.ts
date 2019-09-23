
import { IsString, IsInt, IsOptional, IsNumber, IsDate, IsBoolean } from 'class-validator';

export default class AccessTokenDto {

  @IsNumber() readonly workerId: number;

  @IsDate() readonly creationDateTime: Date;

  @IsString() readonly accessTokenId: string;

}
