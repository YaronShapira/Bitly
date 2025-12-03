import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
// ----------------------------------------------------

@Injectable()
export class RedirectsService {
  constructor(private prisma: PrismaService) {}

  async getShortUrl(shortUrl: string): Promise<string> {
    const urlRecord = await this.prisma.url.findUnique({
      where: { shortUrl },
      select: { originalUrl: true },
    });

    if (!urlRecord) {
      console.warn(`Short URL not found: ${shortUrl}`);
      throw new NotFoundException(`Short URL '${shortUrl}' not found.`);
    }

    return urlRecord.originalUrl;
  }
}
