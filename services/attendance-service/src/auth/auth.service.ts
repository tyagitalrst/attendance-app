import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    // Check existing email
    const emailExist = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (emailExist) {
      throw new ConflictException('Email already registered');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Store to DB
    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        phoneNumber: dto.phoneNumber,
      },
    });

    // Issued JWT
    const accessToken = this.signToken(user.id, user.role);

    return {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      user: this.sanitize(user),
      accessToken,
    };
  }

  async login(dto: LoginDto) {
    // Get user
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = this.signToken(user.id, user.role);

    return {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      user: this.sanitize(user),
      accessToken,
    };
  }

  private signToken(userId: number, role: string) {
    return this.jwtService.sign({
      sub: userId,
      role,
    });
  }

  private sanitize(user: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unused-vars
    const { password, ...rest } = user;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return rest;
  }
}
