import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Tag } from './entities/tag.entity';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async create(createTagDto: CreateTagDto): Promise<Tag> {
    const normalizedName = createTagDto.name.toLowerCase();

    // Check if tag already exists
    const existingTag = await this.tagRepository.findOne({
      where: { name: normalizedName },
    });

    if (existingTag) {
      throw new ConflictException('Tag with this name already exists');
    }

    const tag = this.tagRepository.create({
      ...createTagDto,
      name: normalizedName,
    });

    return this.tagRepository.save(tag);
  }

  async findAll(): Promise<Tag[]> {
    return this.tagRepository.find();
  }

  async findOne(id: string): Promise<Tag> {
    const tag = await this.tagRepository.findOne({
      where: { id },
      relations: ['bookmarks'],
    });

    if (!tag) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }

    return tag;
  }

  async findByName(name: string): Promise<Tag | null> {
    return this.tagRepository.findOne({
      where: { name: name.toLowerCase() },
    });
  }

  async findOrCreateMany(tagNames: string[]): Promise<Tag[]> {
    if (!tagNames || tagNames.length === 0) {
      return [];
    }

    const normalizedNames = tagNames.map((name) => name.toLowerCase());
    const tags: Tag[] = [];

    // Find existing tags
    const existingTags = await this.tagRepository.find({
      where: { name: In(normalizedNames) },
    });

    const existingTagNames = new Set(existingTags.map((tag) => tag.name));
    tags.push(...existingTags);

    // Create new tags
    const newTagNames = normalizedNames.filter(
      (name) => !existingTagNames.has(name),
    );

    if (newTagNames.length > 0) {
      const newTags = newTagNames.map((name) =>
        this.tagRepository.create({ name }),
      );
      const savedTags = await this.tagRepository.save(newTags);
      tags.push(...savedTags);
    }

    return tags;
  }

  async update(id: string, updateTagDto: UpdateTagDto): Promise<Tag> {
    const tag = await this.findOne(id);

    if (updateTagDto.name) {
      const normalizedName = updateTagDto.name.toLowerCase();

      // Check if new name conflicts with existing tag
      if (normalizedName !== tag.name) {
        const existingTag = await this.tagRepository.findOne({
          where: { name: normalizedName },
        });

        if (existingTag) {
          throw new ConflictException('Tag with this name already exists');
        }

        tag.name = normalizedName;
      }
    }

    if (updateTagDto.color) {
      tag.color = updateTagDto.color;
    }

    return this.tagRepository.save(tag);
  }

  async remove(id: string): Promise<void> {
    const tag = await this.findOne(id);
    await this.tagRepository.remove(tag);
  }
}
