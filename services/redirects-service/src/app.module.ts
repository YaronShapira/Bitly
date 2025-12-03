import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { RedirectsModule } from './modules/redirects/redirects.module';

@Module({
  imports: [PrismaModule, RedirectsModule],
})
export class AppModule {}
