import { Role } from '@prisma/client';
import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsEnum,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail({}, { message: 'Please input a valid email' })
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(4, { message: 'Name must be at least 4 characters' })
  name?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  position?: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
