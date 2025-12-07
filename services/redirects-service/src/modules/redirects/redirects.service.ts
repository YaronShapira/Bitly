import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Redis } from 'ioredis';
import { Inject } from '@nestjs/common';

@Injectable()
export class RedirectsService {
  private readonly CACHE_TTL_SECONDS = 60 * 60 * 24; // 24 hours cache
  private readonly NEGATIVE_CACHE_TTL_SECONDS = 60;

  constructor(
    private readonly prisma: PrismaService,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
  ) {}

  async resolveShortUrl(shortUrl: string): Promise<string> {
    const cacheKey = `url:${shortUrl}`;

    // STEP 1 — try Redis
    const cachedOriginalUrl = await this.redis.get(cacheKey);

    if (cachedOriginalUrl && typeof cachedOriginalUrl === 'string') {
      console.info(`[CACHE HIT] shortUrl=${shortUrl} → ${cachedOriginalUrl}`);

      return cachedOriginalUrl;
    }

    console.info(`[CACHE MISS] shortUrl=${shortUrl}`);

    // STEP 2 — fallback to DB
    const urlRecord = await this.prisma.url.findUnique({
      where: { shortUrl },
      select: { originalUrl: true },
    });

    if (!urlRecord) {
      console.warn(`[NOT FOUND] shortUrl=${shortUrl}`);
      void this.setNegativeCache(cacheKey);
      throw new NotFoundException(`Short URL '${shortUrl}' not found.`);
    }

    const originalUrl = urlRecord.originalUrl;

    // STEP 3 — store in Redis
    void this.setCache(cacheKey, shortUrl, originalUrl);

    return originalUrl;
  }

  private async setCache(cacheKey: string, shortUrl: string, originalUrl: string) {
    try {
      await this.redis.set(cacheKey, originalUrl, 'EX', this.CACHE_TTL_SECONDS);
      console.info(`[CACHE SET] shortUrl=${shortUrl} → ${originalUrl}`);
    } catch (error) {
      console.error('Failed to update cache', error);
    }
  }

  private async setNegativeCache(cacheKey: string) {
    try {
      await this.redis.set(cacheKey, '__not_found__', 'EX', this.NEGATIVE_CACHE_TTL_SECONDS);
      console.info(`[NEGATIVE CACHE SET] shortUrl=${cacheKey}`);
    } catch (error) {
      console.error('Failed to set negative cache', error);
    }
  }
}
