import { Role } from '@prisma/client';
import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsEnum,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Please input a valid email' })
  email!: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password!: string;

  @IsString()
  @MinLength(4, { message: 'Name must be at least 4 characters' })
  name!: string;

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
