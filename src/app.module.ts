import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TocycleModule } from './tocycle/tocycle.module';
import { Site } from './tocycle/site.entity';
import { NaraModule } from './nara/nara.module';
import { NaraProject } from './nara/nara.entity';
import { SoilPost } from './soil-post/soil-post.entity';
import { SoilPostService } from './soil-post/soil-post.service';
import { SoilPostController } from './soil-post/soil-post.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'tocycle.sqlite',
      entities: [Site, NaraProject, SoilPost],
      synchronize: true,
    }),
    TocycleModule,
    NaraModule,
    TypeOrmModule.forFeature([SoilPost]),
  ],

controllers: [SoilPostController],

providers: [SoilPostService],
})
export class AppModule {}