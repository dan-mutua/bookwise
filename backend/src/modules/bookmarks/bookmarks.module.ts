import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookmarksService } from './bookmarks.service';
import { BookmarksController } from './bookmarks.controller';
import { Bookmark } from './entities/bookmark.entity';
import { TagsModule } from '../tags/tags.module';
import { MlModule } from '../ml/ml.module';

@Module({
  imports: [TypeOrmModule.forFeature([Bookmark]), TagsModule, MlModule],
  controllers: [BookmarksController],
  providers: [BookmarksService],
  exports: [BookmarksService],
})
export class BookmarksModule {}
