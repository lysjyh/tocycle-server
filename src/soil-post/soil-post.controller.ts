import { Controller, Get, Post, Body } from '@nestjs/common';
import { SoilPostService } from './soil-post.service';

@Controller('soil-posts')
export class SoilPostController {
  constructor(
    private readonly service: SoilPostService,
  ) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Post()
  create(@Body() body: any) {
    return this.service.create(body);
  }
}