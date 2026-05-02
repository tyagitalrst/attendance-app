import { IsDateString, IsOptional } from 'class-validator';

export class QueryAttendanceDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
