import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AdminUsersController } from './admin.users.controller';
import { AdminUsersService } from './admin.users.service';

@Module({
  imports: [JwtModule.register({})],
  providers: [AdminUsersService],
  controllers: [AdminUsersController],
})
export class AdminModule {}
