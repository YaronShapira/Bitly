import { Controller, Get, Param, Res } from '@nestjs/common';
import { RedirectsService } from './redirects.service';
import type { Response } from 'express';

@Controller()
export class RedirectsController {
  constructor(private readonly redirectsService: RedirectsService) {}

  @Get(':shortUrl')
  async redirectUrl(@Param('shortUrl') shortUrl: string, @Res() res: Response): Promise<void> {
    // Validate shortUrl is String
    const originalUrl = await this.redirectsService.getShortUrl(shortUrl);

    const test = `https://${originalUrl}`;

    console.log(test);

    res.redirect(test);
  }
}
