import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Bookmark } from './entities/bookmark.entity';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';
import { QueryBookmarkDto } from './dto/query-bookmark.dto';
import { TagsService } from '../tags/tags.service';
import { MlService } from '../ml/ml.service';

@Injectable()
export class BookmarksService {
  private readonly logger = new Logger(BookmarksService.name);

  constructor(
    @InjectRepository(Bookmark)
    private readonly bookmarkRepository: Repository<Bookmark>,
    private readonly tagsService: TagsService,
    private readonly mlService: MlService,
  ) {}

  async create(createBookmarkDto: CreateBookmarkDto): Promise<Bookmark> {
    this.logger.log(`Creating bookmark: ${createBookmarkDto.url}`);

    // 1. Call ML service for classification
    const mlResult = await this.mlService.classifyBookmark(
      createBookmarkDto.url,
      createBookmarkDto.title,
      createBookmarkDto.description,
    );

    // 2. Combine user tags with ML suggested tags (deduplicate)
    const userTags = createBookmarkDto.tags || [];
    const allTagNames = Array.from(
      new Set([...userTags, ...mlResult.suggested_tags]),
    );

    // 3. Find or create tags
    const tags = await this.tagsService.findOrCreateMany(allTagNames);

    // 4. Create bookmark with ML data
    const bookmark = this.bookmarkRepository.create({
      url: createBookmarkDto.url,
      title: createBookmarkDto.title,
      description: createBookmarkDto.description,
      favicon: createBookmarkDto.favicon,
      isFavorite: createBookmarkDto.isFavorite || false,
      mlCategory: mlResult.category,
      mlConfidence: mlResult.confidence,
      userId: createBookmarkDto.userId,
      tags,
    });

    const savedBookmark = await this.bookmarkRepository.save(bookmark);

    this.logger.log(
      `Bookmark created with category: ${mlResult.category} (${mlResult.confidence}%)`,
    );

    return this.findOne(savedBookmark.id, createBookmarkDto.userId);
  }

  async findAll(
    userId: string,
    query: QueryBookmarkDto,
  ): Promise<{ data: Bookmark[]; total: number; page: number; limit: number }> {
    const { category, tag, isFavorite, search, page = 1, limit = 20 } = query;

    const queryBuilder = this.bookmarkRepository
      .createQueryBuilder('bookmark')
      .leftJoinAndSelect('bookmark.tags', 'tag')
      .where('bookmark.userId = :userId', { userId });

    // Filter by category
    if (category) {
      queryBuilder.andWhere('bookmark.mlCategory = :category', { category });
    }

    // Filter by tag
    if (tag) {
      queryBuilder.andWhere('tag.name = :tag', { tag: tag.toLowerCase() });
    }

    // Filter by favorite
    if (isFavorite !== undefined) {
      queryBuilder.andWhere('bookmark.isFavorite = :isFavorite', {
        isFavorite,
      });
    }

    // Search in title or description
    if (search) {
      queryBuilder.andWhere(
        '(bookmark.title ILIKE :search OR bookmark.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    // Order by creation date (newest first)
    queryBuilder.orderBy('bookmark.createdAt', 'DESC');

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string, userId: string): Promise<Bookmark> {
    const bookmark = await this.bookmarkRepository.findOne({
      where: { id, userId },
      relations: ['tags'],
    });

    if (!bookmark) {
      throw new NotFoundException(`Bookmark with ID ${id} not found`);
    }

    return bookmark;
  }

  async update(
    id: string,
    userId: string,
    updateBookmarkDto: UpdateBookmarkDto,
  ): Promise<Bookmark> {
    const bookmark = await this.findOne(id, userId);

    // Update basic fields
    if (updateBookmarkDto.url !== undefined) {
      bookmark.url = updateBookmarkDto.url;
    }
    if (updateBookmarkDto.title !== undefined) {
      bookmark.title = updateBookmarkDto.title;
    }
    if (updateBookmarkDto.description !== undefined) {
      bookmark.description = updateBookmarkDto.description;
    }
    if (updateBookmarkDto.favicon !== undefined) {
      bookmark.favicon = updateBookmarkDto.favicon;
    }
    if (updateBookmarkDto.isFavorite !== undefined) {
      bookmark.isFavorite = updateBookmarkDto.isFavorite;
    }

    // Update tags if provided
    if (updateBookmarkDto.tags) {
      const tags = await this.tagsService.findOrCreateMany(
        updateBookmarkDto.tags,
      );
      bookmark.tags = tags;
    }

    await this.bookmarkRepository.save(bookmark);

    return this.findOne(id, userId);
  }

  async remove(id: string, userId: string): Promise<void> {
    const bookmark = await this.findOne(id, userId);
    await this.bookmarkRepository.remove(bookmark);
  }

  async addTag(id: string, userId: string, tagName: string): Promise<Bookmark> {
    const bookmark = await this.findOne(id, userId);

    // Check if tag already exists on bookmark
    const existingTag = bookmark.tags.find(
      (t) => t.name === tagName.toLowerCase(),
    );

    if (existingTag) {
      return bookmark; // Tag already added
    }

    // Find or create tag
    const tags = await this.tagsService.findOrCreateMany([tagName]);
    bookmark.tags.push(tags[0]);

    await this.bookmarkRepository.save(bookmark);

    return this.findOne(id, userId);
  }

  async removeTag(
    id: string,
    userId: string,
    tagId: string,
  ): Promise<Bookmark> {
    const bookmark = await this.findOne(id, userId);

    bookmark.tags = bookmark.tags.filter((tag) => tag.id !== tagId);

    await this.bookmarkRepository.save(bookmark);

    return this.findOne(id, userId);
  }
}
