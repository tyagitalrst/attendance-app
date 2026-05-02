import { IsDateString, IsOptional } from 'class-validator';
import { Type as TypeT } from 'class-transformer';

export class QueryAttendanceDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @TypeT(() => Number)
  userId?: number;
}
