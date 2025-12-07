import { BadRequestException, Controller, Get, Param, Res } from '@nestjs/common';
import { RedirectsService } from './redirects.service';
import type { Response } from 'express';

@Controller()
export class RedirectsController {
  constructor(private readonly redirectsService: RedirectsService) {}

  @Get(':shortUrl')
  async redirectUrl(@Param('shortUrl') shortUrl: string, @Res() res: Response): Promise<any> {
    if (!/^[a-zA-Z0-9_-]+$/.test(shortUrl)) {
      throw new BadRequestException('Invalid short URL format.');
    }

    const originalUrl = await this.redirectsService.resolveShortUrl(shortUrl);

    // res.redirect(301, originalUrl);
    res.status(200).send({ originalUrl });
  }
}
