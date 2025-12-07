import base62 from 'base62';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateUrlDto } from './dto/create-url.dto';
import { Url } from './entities/url.entity';
import { PrismaService } from '../../../prisma/prisma.service';
import Redis from 'ioredis';

@Injectable()
export class UrlsService {
  constructor(
    private prisma: PrismaService,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
  ) {}

  private readonly COUNTER_KEY = 'url:id:counter';

  async createUrl(createUrlDto: CreateUrlDto): Promise<Url> {
    const { originalUrl, customShortUrl = '' } = createUrlDto;

    await this.validateCustomShortUrl(customShortUrl);

    const shortUrl = customShortUrl || (await this.generateShortUrl());

    const url: Omit<Url, 'id' | 'createdAt' | 'updatedAt'> = {
      shortUrl,
      originalUrl,
    };

    console.info(`Successfully created short URL "${shortUrl}" for original URL: ${originalUrl}`);

    const createdUrl = await this.prisma.url.create({ data: url });

    return createdUrl;
  }

  private async validateCustomShortUrl(customShortUrl: string): Promise<void> {
    if (!customShortUrl) {
      return;
    }

    const isCustomUrlExists = await this.prisma.url.findUnique({ where: { shortUrl: customShortUrl } });

    if (isCustomUrlExists) {
      const errorMessage = `Custom short URL "${customShortUrl}" already taken`;

      console.error(errorMessage);
      throw new BadRequestException(errorMessage);
    }
  }

  private async generateShortUrl(): Promise<string> {
    const counter = await this.redis.incr(this.COUNTER_KEY);
    const shortUrl = base62.encode(Number(counter)).padStart(7, '0');

    return shortUrl;
  }
}
