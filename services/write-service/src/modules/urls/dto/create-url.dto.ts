import { IsUrl, IsOptional, IsString, IsNotEmpty, Matches, MaxLength } from 'class-validator';

export class CreateUrlDto {
  @IsUrl({
    require_protocol: true,
  })
  originalUrl: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(32)
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message: 'customShortUrl can only contain letters, numbers, "-" and "_"',
  })
  customShortUrl?: string;
}
