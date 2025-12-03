import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateUrlDto } from './dto/create-url.dto';
import { Url } from './entities/url.entity';

@Injectable()
export class UrlsService {
  constructor() {}

  urls: Url[] = [];

  create(dto: CreateUrlDto): Url {
    if (dto.customShortUrl) {
      const isCustomUrlExists = this.urls.some((url) => url.shortUrl === dto.customShortUrl);

      if (isCustomUrlExists) {
        throw new BadRequestException('Custom short URL already taken');
      }
    }

    // Generate short code if none provided
    const shortUrl = dto.customShortUrl ?? this.generateShortUrl();

    const url: Url = {
      id: this.urls.length + 1,
      shortUrl,
      originalUrl: dto.originalUrl,
      createdAt: new Date(),
    };

    this.urls.push(url);

    console.log({ urls: this.urls });

    return url;
  }

  private generateShortUrl(): string {
    return Math.random().toString(36).substring(2, 8);
  }
}
