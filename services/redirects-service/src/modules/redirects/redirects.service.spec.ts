/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { RedirectsService } from './redirects.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { Redis } from 'ioredis';

describe('RedirectsService', () => {
  let service: RedirectsService;
  let prisma: PrismaService;
  let redis: Redis;

  beforeEach(async () => {
    const redisMock = {
      get: jest.fn(),
      set: jest.fn(),
    } as unknown as Redis;

    const prismaMock = {
      url: {
        findUnique: jest.fn(),
      },
    } as unknown as PrismaService;

    const module: TestingModule = await Test.createTestingModule({
      providers: [RedirectsService, { provide: PrismaService, useValue: prismaMock }, { provide: 'REDIS_CLIENT', useValue: redisMock }],
    }).compile();

    service = module.get<RedirectsService>(RedirectsService);
    prisma = module.get<PrismaService>(PrismaService);
    redis = module.get<Redis>('REDIS_CLIENT');
  });

  it('returns URL from cache (cache hit)', async () => {
    redis.get = jest.fn().mockResolvedValue('https://google.com');

    const result = await service.resolveShortUrl('abc123');

    expect(result).toBe('https://google.com');
    expect(redis.get).toHaveBeenCalledWith('url:abc123');
    expect(prisma.url.findUnique).not.toHaveBeenCalled();
  });

  it('returns URL from DB on cache miss and stores it in cache', async () => {
    redis.get = jest.fn().mockResolvedValue(null);
    prisma.url.findUnique = jest.fn().mockResolvedValue({ originalUrl: 'https://github.com' });
    redis.set = jest.fn().mockResolvedValue('OK');

    const result = await service.resolveShortUrl('xxx');

    expect(result).toBe('https://github.com');
    expect(redis.set).toHaveBeenCalled();
  });

  it('throws NotFoundException when slug not found', async () => {
    redis.get = jest.fn().mockResolvedValue(null);
    prisma.url.findUnique = jest.fn().mockResolvedValue(null);

    await expect(service.resolveShortUrl('nope')).rejects.toThrow("Short URL 'nope' not found.");
  });
});
