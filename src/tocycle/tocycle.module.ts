import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TocycleService } from './tocycle.service';
import { TocycleController } from './tocycle.controller';
import { Site } from './site.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Site])],
  controllers: [TocycleController],
  providers: [TocycleService],
})
export class TocycleModule {}