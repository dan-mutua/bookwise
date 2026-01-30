import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { databaseConfig } from './config/database.config';
import { UsersModule } from './modules/users/users.module';
import { BookmarksModule } from './modules/bookmarks/bookmarks.module';
import { TagsModule } from './modules/tags/tags.module';
import { MlModule } from './modules/ml/ml.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    HttpModule,
    UsersModule,
    BookmarksModule,
    TagsModule,
    MlModule,
  ],
})
export class AppModule {}
