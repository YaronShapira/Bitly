import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { UrlsService } from './urls.service';

const prismaServiceMock = {
  url: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
};

// Define the mock result structure (matching your Url entity structure)
const MOCK_CREATED_URL = {
  id: 1,
  shortUrl: 'mocked',
  originalUrl: 'https://google.com',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('UrlsService', () => {
  let service: UrlsService;
  let prisma: typeof prismaServiceMock;

  beforeEach(async () => {
    // 2. Set up the testing module to provide the real service
    //    and the mocked dependency (PrismaService).
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlsService,
        {
          provide: PrismaService,
          useValue: prismaServiceMock, // Use the mock object
        },
      ],
    }).compile();

    service = module.get<UrlsService>(UrlsService);
    prisma = module.get(PrismaService);

    // Clear mocks before each test to ensure isolation
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // --- Test Case 1: Create with generated URL ---
  it('should create a new URL with a generated short URL', async () => {
    const originalUrl = 'https://google.com';
    const dto = { originalUrl };

    // Mock the dependency returns:
    // 1. First check (findUnique) should return null (URL not taken)
    prisma.url.findUnique.mockResolvedValue(null);

    // 2. Create should return the mock data
    // NOTE: Your service calls this twice for some reason, so we mock twice
    prisma.url.create.mockResolvedValue(MOCK_CREATED_URL);

    // Spy on the private method that generates the URL
    const generateSpy = jest.spyOn(service as any, 'generateShortUrl').mockReturnValue('random6');

    const result = await service.createUrl(dto);

    expect(result.originalUrl).toBe(originalUrl);
    expect(prisma.url.create).toHaveBeenCalledWith({ data: { shortUrl: 'random6', originalUrl } });
    expect(generateSpy).toHaveBeenCalled();
  });

  // --- Test Case 2: Create with custom URL ---
  it('should use the custom short URL when provided', async () => {
    const dto = { originalUrl: 'https://youtube.com', customShortUrl: 'custom123' };

    // Mock the dependency returns:
    // 1. First check (findUnique) should return null (URL not taken)
    prisma.url.findUnique.mockResolvedValue(null);

    // 2. Create should return the mock data
    prisma.url.create.mockResolvedValue({ ...MOCK_CREATED_URL, shortUrl: 'custom123' });

    const result = await service.createUrl(dto);

    expect(result.shortUrl).toBe('custom123');
    expect(prisma.url.findUnique).toHaveBeenCalledWith({ where: { shortUrl: 'custom123' } });
  });

  // --- Test Case 3: Throw on collision ---
  it('should throw BadRequestException if custom short URL already exists', async () => {
    const customShortUrl = 'taken';
    const dto = { originalUrl: 'https://youtube.com', customShortUrl };

    // Mock the dependency returns:
    // 1. findUnique should return a record (meaning it exists)
    prisma.url.findUnique.mockResolvedValue(MOCK_CREATED_URL);

    // We must use await/rejects to test async functions that throw
    await expect(service.createUrl(dto)).rejects.toThrow(BadRequestException);
    expect(prisma.url.findUnique).toHaveBeenCalledWith({ where: { shortUrl: customShortUrl } });
    expect(prisma.url.create).not.toHaveBeenCalled(); // Ensure create wasn't called
  });
});
