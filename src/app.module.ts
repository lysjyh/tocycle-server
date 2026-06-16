import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TocycleModule } from './tocycle/tocycle.module';
import { Site } from './tocycle/site.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'tocycle.sqlite',
      entities: [Site],
      synchronize: true,
    }),
    TocycleModule,
  ],
})
export class AppModule {}