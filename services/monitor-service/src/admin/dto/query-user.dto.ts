import { Role } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class QueryUserDto {
  @IsOptional()
  @IsString()
  searchKeyword?: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
