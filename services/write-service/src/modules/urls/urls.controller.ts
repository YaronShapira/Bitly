import { Body, Controller, Post } from '@nestjs/common';
import { UrlsService } from './urls.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { Url } from './entities/url.entity';

@Controller('urls')
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Post()
  createUrl(@Body() dto: CreateUrlDto): Url {
    return this.urlsService.create(dto);
  }
}
