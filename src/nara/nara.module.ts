import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NaraProject } from './nara.entity';
import { NaraService } from './nara.service';
import { NaraController } from './nara.controller';

@Module({
  imports: [TypeOrmModule.forFeature([NaraProject])],
  providers: [NaraService],
  controllers: [NaraController],
})
export class NaraModule {}