import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Please input a valid email' })
  email!: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 8 characters' })
  password!: string;

  @IsString()
  @MinLength(4, { message: 'Name must be at least 4 characters' })
  name!: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;
}
