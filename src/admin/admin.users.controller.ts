import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import RoleGuard from '../auth/guards/role.guard';
import { AdminUsersService } from './admin.users.service';
import { GetAdminUsersResDto } from './dto/response/get.admin.users.res.dto';

@Controller('admin/users')
export class AdminUsersController {
  constructor(private readonly adminUsersService: AdminUsersService) {}

  @UseGuards(RoleGuard(['ADMIN']))
  @Get()
  public async getUsers(): Promise<GetAdminUsersResDto> {
    return await this.adminUsersService.getUsers();
  }
}
