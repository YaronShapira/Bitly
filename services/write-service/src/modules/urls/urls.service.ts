import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUrlDto } from './dto/create-url.dto';
import { Url } from './entities/url.entity';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class UrlsService {
  constructor(private prisma: PrismaService) {}

  async createUrl(createUrlDto: CreateUrlDto): Promise<Url> {
    const { originalUrl, customShortUrl = '' } = createUrlDto;

    await this.validateCustomShortUrl(customShortUrl);

    const shortUrl = customShortUrl || this.generateShortUrl();

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

  // TODO: Improve this function to avoid collisions
  private generateShortUrl(): string {
    return Math.random().toString(36).substring(2, 8);
  }
}
