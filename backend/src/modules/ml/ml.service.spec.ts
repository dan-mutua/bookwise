import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { of, throwError } from 'rxjs';
import { MlService } from './ml.service';

describe('MlService', () => {
  let service: MlService;
  let httpService: jest.Mocked<HttpService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MlService,
        {
          provide: HttpService,
          useValue: {
            post: jest.fn(),
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MlService>(MlService);
    httpService = module.get(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('classifyBookmark', () => {
    it('should return classification result on success', async () => {
      const mockResponse = {
        data: {
          category: 'technology',
          confidence: 60,
          suggested_tags: ['github', 'nestjs'],
        },
      };

      httpService.post.mockReturnValue(of(mockResponse) as any);

      const result = await service.classifyBookmark(
        'https://github.com/nestjs/nest',
        'NestJS Framework',
      );

      expect(result).toEqual(mockResponse.data);
      expect(httpService.post).toHaveBeenCalledWith(
        expect.stringContaining('/classify'),
        expect.objectContaining({
          url: 'https://github.com/nestjs/nest',
          title: 'NestJS Framework',
        }),
      );
    });

    it('should return fallback result on HTTP error', async () => {
      httpService.post.mockReturnValue(
        throwError(() => new Error('Network error')) as any,
      );

      const result = await service.classifyBookmark(
        'https://example.com',
        'Test',
      );

      expect(result).toEqual({
        category: 'uncategorized',
        confidence: 0,
        suggested_tags: [],
      });
    });

    it('should return fallback result on timeout', async () => {
      httpService.post.mockReturnValue(
        throwError(() => new Error('Timeout')) as any,
      );

      const result = await service.classifyBookmark(
        'https://example.com',
        'Test',
      );

      expect(result).toEqual({
        category: 'uncategorized',
        confidence: 0,
        suggested_tags: [],
      });
    });

    it('should include description in request if provided', async () => {
      const mockResponse = {
        data: {
          category: 'technology',
          confidence: 70,
          suggested_tags: [],
        },
      };

      httpService.post.mockReturnValue(of(mockResponse) as any);

      await service.classifyBookmark(
        'https://example.com',
        'Test',
        'Test description',
      );

      expect(httpService.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          description: 'Test description',
        }),
      );
    });
  });

  describe('healthCheck', () => {
    it('should return true if ML service is healthy', async () => {
      httpService.get.mockReturnValue(
        of({ data: { status: 'healthy' } }) as any,
      );

      const result = await service.healthCheck();

      expect(result).toBe(true);
    });

    it('should return false if ML service is unhealthy', async () => {
      httpService.get.mockReturnValue(
        throwError(() => new Error('Service down')) as any,
      );

      const result = await service.healthCheck();

      expect(result).toBe(false);
    });
  });
});
