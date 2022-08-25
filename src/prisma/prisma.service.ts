import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private readonly configService: ConfigService) {
    //remeber that prisma default time zone is UTC!
    super({
      datasources: { db: { url: configService.get<string>('DATABASE_URL') } },
    });
    //remember to use deleted property when find or findMany
    this.$use(async (params, next) => {
      if (params.model == 'User') {
        if (params.action == 'delete') {
          params.action = 'update';
          params.args['data'] = { deleted: true };
        }
        if (params.action == 'deleteMany') {
          params.action = 'updateMany';
          if (params.args.data != undefined) {
            params.args.data['deleted'] = true;
          } else {
            params.args['data'] = { deleted: true };
          }
        }
      }
      return next(params);
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    this.$disconnect();
  }
}
