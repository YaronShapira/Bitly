/* eslint-disable @typescript-eslint/no-unsafe-return */
// redis.module.ts
import { Module, Global } from '@nestjs/common';
import Redis from 'ioredis';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: () =>
        new Redis({
          host: 'localhost',
          port: 6379,
        }),
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule {}
