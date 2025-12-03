import { Module } from '@nestjs/common';
import { RedirectsController } from './redirects.controller';
import { RedirectsService } from './redirects.service';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RedirectsController],
  providers: [RedirectsService],
})
export class RedirectsModule {}
