import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminUsersService {
  constructor(private prisma: PrismaService) {}

  public async getUsers(page?: string) {
    const ONE_PAGE_COUNT = 20;
    const pagesCount = Math.ceil(await this.prisma.user.count({}));
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      skip: (Number(page) - 1) * ONE_PAGE_COUNT,
      take: ONE_PAGE_COUNT,
    });
    return {
      users: users.map((user) => {
        return {
          id: user.id,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          deleted: user.deleted,
          name: user.name,
          telephone: user.telephone,
          nickname: user.nickname,
          email: user.email,
        };
      }),
      pagesCount,
    };
  }
}
