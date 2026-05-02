import {
  Controller,
  Param,
  ParseIntPipe,
  Get,
  Query,
  Post,
  Body,
  Patch,
  Delete,
} from '@nestjs/common';
import { AdminOnly } from '../user-identity/decorators/admin-only.decorator';
import { AdminService } from './admin.service';
import { QueryUserDto } from './dto/query-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryAttendanceDto } from './dto/query-attendance.dto';

@Controller('admin')
@AdminOnly()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  getUserList(@Query() query: QueryUserDto) {
    return this.adminService.getUserList(query);
  }

  @Get('users/:id')
  getUser(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.getUser(id);
  }

  @Post('users')
  createUser(@Body() dto: CreateUserDto) {
    return this.adminService.createUser(dto);
  }

  @Patch('users/:id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
  ) {
    return this.adminService.updateUser(id, dto);
  }

  @Delete('users/:id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteUser(id);
  }

  @Get('attendances')
  getAttendanceList(@Query() query: QueryAttendanceDto) {
    return this.adminService.getAttendanceList(query);
  }
}
