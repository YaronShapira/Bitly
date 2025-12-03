import { Module } from '@nestjs/common';
import { UrlsModule } from './modules/urls/urls.module';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [PrismaModule, UrlsModule],
})
export class AppModule {}
