import { Module } from '@nestjs/common';
import { RedirectsController } from './redirects.controller';
import { RedirectsService } from './redirects.service';
import { PrismaModule } from 'prisma/prisma.module';
import { RedisModule } from 'src/infra/redis.module';

@Module({
  imports: [PrismaModule, RedisModule],
  controllers: [RedirectsController],
  providers: [RedirectsService],
})
export class RedirectsModule {}
