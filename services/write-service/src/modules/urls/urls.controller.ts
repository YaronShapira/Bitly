import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { UrlsService } from './urls.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { Url } from './entities/url.entity';

@Controller('urls')
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUrl(@Body() dto: CreateUrlDto): Promise<Url> {
    return this.urlsService.createUrl(dto);
  }
}
