import { IsUrl, IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class CreateUrlDto {
  @IsUrl()
  originalUrl: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  customShortUrl?: string;
}
