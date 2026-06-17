import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TocycleModule } from './tocycle/tocycle.module';
import { Site } from './tocycle/site.entity';
import { NaraModule } from './nara/nara.module';
import { NaraProject } from './nara/nara.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'tocycle.sqlite',
      entities: [Site, NaraProject],
      synchronize: true,
    }),
    TocycleModule,
    NaraModule,
  ],
})
export class AppModule {}