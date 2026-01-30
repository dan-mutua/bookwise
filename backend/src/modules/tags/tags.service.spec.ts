import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TagsService } from './tags.service';
import { Tag } from './entities/tag.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('TagsService', () => {
  let service: TagsService;
  let repository: jest.Mocked<Repository<Tag>>;

  const mockTag = {
    id: '1',
    name: 'nodejs',
    color: '#6366f1',
    createdAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TagsService,
        {
          provide: getRepositoryToken(Tag),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TagsService>(TagsService);
    repository = module.get(getRepositoryToken(Tag));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a tag with lowercase name', async () => {
      const createDto = { name: 'NodeJS', color: '#ff0000' };

      repository.findOne.mockResolvedValue(null);
      repository.create.mockReturnValue({
        ...mockTag,
        name: 'nodejs',
        color: '#ff0000',
      } as any);
      repository.save.mockResolvedValue({
        ...mockTag,
        name: 'nodejs',
        color: '#ff0000',
      } as any);

      const result = await service.create(createDto);

      expect(result.name).toBe('nodejs');
      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'nodejs' }),
      );
    });

    it('should throw ConflictException if tag name exists', async () => {
      const createDto = { name: 'nodejs' };

      repository.findOne.mockResolvedValue(mockTag as any);

      await expect(service.create(createDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findOrCreateMany', () => {
    it('should return existing tags and create new ones', async () => {
      const tagNames = ['nodejs', 'typescript', 'javascript'];

      const existingTags = [mockTag];

      const newTags = [
        {
          id: '2',
          name: 'typescript',
          color: '#6366f1',
          createdAt: new Date(),
        },
        {
          id: '3',
          name: 'javascript',
          color: '#6366f1',
          createdAt: new Date(),
        },
      ];

      repository.find.mockResolvedValue(existingTags as any);
      repository.create.mockImplementation(
        (dto: any) => ({ ...dto, id: 'new-id' } as any),
      );
      repository.save.mockResolvedValue(newTags as any);

      const result = await service.findOrCreateMany(tagNames);

      expect(result).toHaveLength(3);
      expect(repository.find).toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalled();
    });

    it('should return empty array for empty input', async () => {
      const result = await service.findOrCreateMany([]);

      expect(result).toEqual([]);
      expect(repository.find).not.toHaveBeenCalled();
    });

    it('should normalize tag names to lowercase', async () => {
      const tagNames = ['NodeJS', 'TypeScript'];

      repository.find.mockResolvedValue([]);
      repository.create.mockImplementation(
        (dto: any) => ({ ...dto, id: 'new-id' } as any),
      );
      repository.save.mockResolvedValue([
        { id: '1', name: 'nodejs', color: '#6366f1', createdAt: new Date() },
        {
          id: '2',
          name: 'typescript',
          color: '#6366f1',
          createdAt: new Date(),
        },
      ] as any);

      await service.findOrCreateMany(tagNames);

      expect(repository.create).toHaveBeenCalledTimes(2);
    });

    it('should handle duplicate names in input', async () => {
      const tagNames = ['nodejs', 'NODEJS', 'NodeJs']; // All same when normalized

      repository.find.mockResolvedValue([mockTag as any]);
      repository.create.mockImplementation(
        (dto: any) => ({ ...dto, id: 'new-id' } as any),
      );
      repository.save.mockResolvedValue([] as any);

      const result = await service.findOrCreateMany(tagNames);

      // Should only return one tag
      expect(result).toHaveLength(1);
    });
  });

  describe('findOne', () => {
    it('should return a tag if found', async () => {
      repository.findOne.mockResolvedValue(mockTag as any);

      const result = await service.findOne('1');

      expect(result).toEqual(mockTag);
    });

    it('should throw NotFoundException if tag not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update tag name and color', async () => {
      const updateDto = { name: 'Updated', color: '#ff0000' };

      repository.findOne
        .mockResolvedValueOnce(mockTag as any)
        .mockResolvedValueOnce(null); // No conflict

      repository.save.mockResolvedValue({
        ...mockTag,
        name: 'updated',
        color: '#ff0000',
      } as any);

      const result = await service.update('1', updateDto);

      expect(result.name).toBe('updated');
      expect(result.color).toBe('#ff0000');
    });

    it('should throw ConflictException if new name conflicts', async () => {
      const updateDto = { name: 'existing-tag' };

      repository.findOne
        .mockResolvedValueOnce(mockTag as any)
        .mockResolvedValueOnce({ id: '2', name: 'existing-tag' } as any);

      await expect(service.update('1', updateDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a tag', async () => {
      repository.findOne.mockResolvedValue(mockTag as any);
      repository.remove.mockResolvedValue(mockTag as any);

      await service.remove('1');

      expect(repository.remove).toHaveBeenCalledWith(mockTag);
    });

    it('should throw NotFoundException if tag not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.remove('999')).rejects.toThrow(NotFoundException);
    });
  });
});
