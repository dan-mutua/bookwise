import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookmarksService } from './bookmarks.service';
import { Bookmark } from './entities/bookmark.entity';
import { TagsService } from '../tags/tags.service';
import { MlService } from '../ml/ml.service';
import { NotFoundException } from '@nestjs/common';

describe('BookmarksService', () => {
  let service: BookmarksService;
  let bookmarkRepository: jest.Mocked<Repository<Bookmark>>;
  let tagsService: jest.Mocked<TagsService>;
  let mlService: jest.Mocked<MlService>;

  const mockBookmark = {
    id: '1',
    url: 'https://github.com/nestjs/nest',
    title: 'NestJS Framework',
    description: 'Progressive Node.js framework',
    favicon: null,
    isFavorite: false,
    mlCategory: 'technology',
    mlConfidence: 60,
    userId: 'user-1',
    tags: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookmarksService,
        {
          provide: getRepositoryToken(Bookmark),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
            createQueryBuilder: jest.fn(),
          },
        },
        {
          provide: TagsService,
          useValue: {
            findOrCreateMany: jest.fn(),
          },
        },
        {
          provide: MlService,
          useValue: {
            classifyBookmark: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BookmarksService>(BookmarksService);
    bookmarkRepository = module.get(getRepositoryToken(Bookmark));
    tagsService = module.get(TagsService);
    mlService = module.get(MlService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a bookmark with ML classification', async () => {
      const createDto = {
        url: 'https://github.com/nestjs/nest',
        title: 'NestJS Framework',
        description: 'Progressive Node.js framework',
        userId: 'user-1',
        tags: ['nodejs'],
      };

      const mlResult = {
        category: 'technology',
        confidence: 60,
        suggested_tags: ['github', 'nestjs'],
      };

      const mockTags = [
        { id: '1', name: 'nodejs', color: '#6366f1', createdAt: new Date() },
        { id: '2', name: 'github', color: '#6366f1', createdAt: new Date() },
        { id: '3', name: 'nestjs', color: '#6366f1', createdAt: new Date() },
      ];

      mlService.classifyBookmark.mockResolvedValue(mlResult);
      tagsService.findOrCreateMany.mockResolvedValue(mockTags);
      bookmarkRepository.create.mockReturnValue(mockBookmark as any);
      bookmarkRepository.save.mockResolvedValue(mockBookmark as any);
      bookmarkRepository.findOne.mockResolvedValue({
        ...mockBookmark,
        tags: mockTags,
      } as any);

      const result = await service.create(createDto);

      expect(mlService.classifyBookmark).toHaveBeenCalledWith(
        createDto.url,
        createDto.title,
        createDto.description,
      );
      expect(tagsService.findOrCreateMany).toHaveBeenCalledWith([
        'nodejs',
        'github',
        'nestjs',
      ]);
      expect(bookmarkRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          mlCategory: 'technology',
          mlConfidence: 60,
        }),
      );
      expect(result).toBeDefined();
      expect(result.tags).toHaveLength(3);
    });

    it('should handle ML service failure gracefully', async () => {
      const createDto = {
        url: 'https://example.com',
        title: 'Test',
        userId: 'user-1',
      };

      // ML service returns fallback
      mlService.classifyBookmark.mockResolvedValue({
        category: 'uncategorized',
        confidence: 0,
        suggested_tags: [],
      });

      tagsService.findOrCreateMany.mockResolvedValue([]);
      bookmarkRepository.create.mockReturnValue(mockBookmark as any);
      bookmarkRepository.save.mockResolvedValue(mockBookmark as any);
      bookmarkRepository.findOne.mockResolvedValue(mockBookmark as any);

      const result = await service.create(createDto);

      expect(result).toBeDefined();
      expect(mlService.classifyBookmark).toHaveBeenCalled();
    });

    it('should deduplicate tags (user + ML suggested)', async () => {
      const createDto = {
        url: 'https://github.com/test',
        title: 'Test',
        userId: 'user-1',
        tags: ['github', 'test'],
      };

      mlService.classifyBookmark.mockResolvedValue({
        category: 'technology',
        confidence: 60,
        suggested_tags: ['github', 'repository'], // 'github' is duplicate
      });

      tagsService.findOrCreateMany.mockResolvedValue([]);
      bookmarkRepository.create.mockReturnValue(mockBookmark as any);
      bookmarkRepository.save.mockResolvedValue(mockBookmark as any);
      bookmarkRepository.findOne.mockResolvedValue(mockBookmark as any);

      await service.create(createDto);

      // Should call with deduplicated tags
      expect(tagsService.findOrCreateMany).toHaveBeenCalledWith([
        'github',
        'test',
        'repository',
      ]);
    });
  });

  describe('findOne', () => {
    it('should return a bookmark if found', async () => {
      bookmarkRepository.findOne.mockResolvedValue(mockBookmark as any);

      const result = await service.findOne('1', 'user-1');

      expect(result).toEqual(mockBookmark);
      expect(bookmarkRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1', userId: 'user-1' },
        relations: ['tags'],
      });
    });

    it('should throw NotFoundException if bookmark not found', async () => {
      bookmarkRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('999', 'user-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should enforce user isolation', async () => {
      bookmarkRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('1', 'wrong-user')).rejects.toThrow(
        NotFoundException,
      );

      expect(bookmarkRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1', userId: 'wrong-user' },
        relations: ['tags'],
      });
    });
  });

  describe('update', () => {
    it('should update bookmark fields', async () => {
      const updateDto = {
        title: 'Updated Title',
        isFavorite: true,
      };

      bookmarkRepository.findOne.mockResolvedValue(mockBookmark as any);
      bookmarkRepository.save.mockResolvedValue({
        ...mockBookmark,
        ...updateDto,
      } as any);

      const result = await service.update('1', 'user-1', updateDto);

      expect(bookmarkRepository.save).toHaveBeenCalled();
      expect(bookmarkRepository.findOne).toHaveBeenCalledTimes(2); // Once in update, once in findOne
    });

    it('should update tags if provided', async () => {
      const updateDto = {
        tags: ['new-tag'],
      };

      const newTags = [
        { id: '4', name: 'new-tag', color: '#6366f1', createdAt: new Date() },
      ];

      bookmarkRepository.findOne.mockResolvedValue(mockBookmark as any);
      tagsService.findOrCreateMany.mockResolvedValue(newTags);
      bookmarkRepository.save.mockResolvedValue(mockBookmark as any);

      await service.update('1', 'user-1', updateDto);

      expect(tagsService.findOrCreateMany).toHaveBeenCalledWith(['new-tag']);
    });
  });

  describe('remove', () => {
    it('should remove a bookmark', async () => {
      bookmarkRepository.findOne.mockResolvedValue(mockBookmark as any);
      bookmarkRepository.remove.mockResolvedValue(mockBookmark as any);

      await service.remove('1', 'user-1');

      expect(bookmarkRepository.remove).toHaveBeenCalledWith(mockBookmark);
    });

    it('should throw NotFoundException if bookmark not found', async () => {
      bookmarkRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('999', 'user-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
